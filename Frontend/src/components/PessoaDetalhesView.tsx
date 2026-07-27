/**
 * Visão Detalhada de uma Pessoa Individual (Dashboard + Histórico Completo com Paginação da API)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Wallet,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatarMoeda, formatarData } from '../utils/formatters';
import { apiService, ResumoPessoaDTO } from '../services/apiService';
import { TransacaoDetalhesModal } from './TransacaoDetalhesModal';

interface PessoaDetalhesViewProps {
  pessoaId: string;
  onVoltar: () => void;
  onNovaTransacao: (pessoaId: string) => void;
}

export const PessoaDetalhesView: React.FC<PessoaDetalhesViewProps> = ({
  pessoaId,
  onVoltar,
  onNovaTransacao,
}) => {
  const { pessoas, deletarTransacao } = useFinance();

  // Dados locais de fallback enquanto a API carrega
  const pessoaLocal = pessoas.find((p) => String(p.id).toLowerCase() === String(pessoaId).toLowerCase());

  // Estados dos Filtros e Paginação
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [dataInicio, setDataInicio] = useState<string>(''); // Estado para Data Início
  const [dataFim, setDataFim] = useState<string>('');       // Estado para Data Fim
  const [pagina, setPagina] = useState<number>(1);
  const tamanhoPagina = 5;

  // Estados da API Backend
  const [dadosResumo, setDadosResumo] = useState<ResumoPessoaDTO | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Estado do Modal de Detalhes
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<any | null>(null);

  // Busca o resumo com as transações filtradas e paginadas
  const carregarDadosPessoa = useCallback(async () => {
    setCarregando(true);
    setErroApi(null);
    try {
      const data = await apiService.obterResumoPessoaPaginado(
        pessoaId,
        busca,
        filtroTipo,
        dataInicio || undefined, // Repassa data início se preenchida
        dataFim || undefined,    // Repassa data fim se preenchida
        pagina,
        tamanhoPagina
      );
      setDadosResumo(data);
    } catch (err: any) {
      setErroApi(err.message || 'Erro ao carregar detalhes da pessoa.');
    } finally {
      setCarregando(false);
    }
  }, [pessoaId, busca, filtroTipo, dataInicio, dataFim, pagina]);

  useEffect(() => {
    carregarDadosPessoa();
  }, [carregarDadosPessoa]);

  // Reseta para a página 1 ao alterar busca, tipo ou datas
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value);
    setPagina(1);
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroTipo(e.target.value);
    setPagina(1);
  };

  const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataInicio(e.target.value);
    setPagina(1);
  };

  const handleDataFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFim(e.target.value);
    setPagina(1);
  };

  const handleDeletar = async (transacaoId: string, desc: string) => {
    try {
      await deletarTransacao(transacaoId);
      setSucesso(`Transação "${desc}" excluída com sucesso!`);
      setTimeout(() => setSucesso(null), 3500);
      carregarDadosPessoa();
    } catch (err: any) {
      setErroApi(err.message || 'Erro ao excluir transação.');
    }
  };

  const nomeExibicao = dadosResumo?.pessoa?.nome || pessoaLocal?.nome || 'Pessoa';
  const idadeExibicao = dadosResumo?.pessoa?.idade ?? pessoaLocal?.idade ?? 0;
  const ehMenor = idadeExibicao < 18;

  return (
    <div className="space-y-6">
      {/* Botão de Voltar + Cabeçalho do Perfil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista Geral</span>
        </button>

        <button
          onClick={() => onNovaTransacao(pessoaId)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Cadastrar Transação para {nomeExibicao.split(' ')[0]}</span>
        </button>
      </div>

      {/* Cartão de Perfil do Membro */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${
              ehMenor
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/60'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border dark:border-indigo-800/60'
            }`}
          >
            {nomeExibicao.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {nomeExibicao}
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  ehMenor
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {idadeExibicao} anos {ehMenor && '• Menor de Idade'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>ID: {pessoaId}</span>
              <span>•</span>
              <span>{dadosResumo?.qtdTransacoes ?? 0} lançamento(s) registrado(s)</span>
            </p>

            {ehMenor && (
              <div className="mt-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Restrição ativada: menores de idade podem registrar apenas despesas.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DASHBOARD INDIVIDUAL: TOTAIS DO USUÁRIO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Receitas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Quanto Coloca na Casa (Receitas)
            </span>
            <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border dark:border-emerald-800/60 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatarMoeda(dadosResumo?.totalReceitas ?? 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total bruto de entradas financeiras de {nomeExibicao.split(' ')[0]}
          </p>
        </div>

        {/* Despesas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Quanto Gastou (Despesas)
            </span>
            <div className="p-2 bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 dark:border dark:border-rose-800/60 rounded-xl">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatarMoeda(dadosResumo?.totalDespesas ?? 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total de saídas registradas em nome desta pessoa
          </p>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Saldo da Pessoa
            </span>
            <div
              className={`p-2 rounded-xl ${
                (dadosResumo?.saldo ?? 0) >= 0
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 dark:border dark:border-indigo-800/60'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 dark:border dark:border-rose-800/60'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl font-black ${
              (dadosResumo?.saldo ?? 0) > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : (dadosResumo?.saldo ?? 0) < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {formatarMoeda(dadosResumo?.saldo ?? 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {(dadosResumo?.saldo ?? 0) >= 0
              ? 'Contribuição positiva para a renda da casa'
              : 'Gastou mais do que colocou na residência'}
          </p>
        </div>
      </div>

      {/* LISTAGEM COM FILTRO E PAGINAÇÃO */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Wallet className="w-5 h-5" />
              </div>
              <span>Extrato Individual de Transações ({dadosResumo?.totalTransacoesFiltradas ?? 0})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Histórico completo de compras, contas e receitas de {nomeExibicao}. Clique em um lançamento para ver mais detalhes.
            </p>
          </div>
        </div>

        {/* Notificações */}
        {sucesso && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{sucesso}</span>
          </div>
        )}

        {erroApi && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{erroApi}</span>
          </div>
        )}
<div className="flex flex-col lg:flex-row gap-3 w-full">

  {/* Busca */}
<div className="relative w-full lg:flex-1 min-w-0">
  <Search
    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
    style={{ left: '12px' }}
  />

  <input
    type="text"
    placeholder="Buscar por descrição..."
    value={busca}
    onChange={handleBuscaChange}
    style={{ paddingLeft: '36px' }}
    className="w-full pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

  {/* Tipo */}
  <div className="w-full lg:w-40 lg:flex-none">
    <select
      value={filtroTipo}
      onChange={handleTipoChange}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
    >
      <option value="todos">Todos</option>
      <option value="receita">Receitas (+)</option>
      <option value="despesa">Despesas (-)</option>
    </select>
  </div>

  {/* Data Inicial */}
  <div className="w-full lg:w-[170px] lg:flex-none">
    <input
      type="date"
      value={dataInicio}
      onChange={handleDataInicioChange}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
    />
  </div>

  {/* Data Final */}
  <div className="w-full lg:w-[170px] lg:flex-none">
    <input
      type="date"
      value={dataFim}
      onChange={handleDataFimChange}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
    />
  </div>

</div>
        {/* Conteúdo: Loading / Vazio / Tabela */}
        {carregando ? (
          <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span>Carregando extrato...</span>
          </div>
        ) : !dadosResumo || dadosResumo.ultimasTransacoes.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Nenhuma transação encontrada
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Nenhum lançamento atende aos critérios de busca selecionados para {nomeExibicao}.
            </p>
            <button
              onClick={() => onNovaTransacao(pessoaId)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Lançar Transação
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {dadosResumo.ultimasTransacoes.map((t) => {
                const ehReceita = t.tipo.toLowerCase() === 'receita';

                return (
                  <div
                    key={t.id}
                    onClick={() =>
                      setTransacaoSelecionada({
                        ...t,
                        pessoaNome: nomeExibicao,
                      })
                    }
                    className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-4 transition-all hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                          ehReceita
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 dark:border dark:border-rose-800/60'
                        }`}
                      >
                        {ehReceita ? (
                          <ArrowUpRight className="w-4.5 h-4.5" />
                        ) : (
                          <ArrowDownRight className="w-4.5 h-4.5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {t.descricao}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatarData(t.dataTransacao || t.dataCriacao || '')}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{t.tipo}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`font-bold text-xs sm:text-sm block ${
                        ehReceita
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {ehReceita ? '+' : '-'} {formatarMoeda(t.valor)}
                    </span>
                  </div>
                </div>
              </div>
              );
              })}
            </div>

            {/* CONTROLES DE PAGINAÇÃO */}
            {dadosResumo.totalPaginas > 1 && (
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Página <strong>{dadosResumo.paginaAtual}</strong> de{' '}
                  <strong>{dadosResumo.totalPaginas}</strong> ({dadosResumo.totalTransacoesFiltradas} registros)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                    disabled={dadosResumo.paginaAtual <= 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Página Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPagina((prev) => Math.min(prev + 1, dadosResumo.totalPaginas))}
                    disabled={dadosResumo.paginaAtual >= dadosResumo.totalPaginas}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Próxima Página"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Detalhes da Transação */}
      <TransacaoDetalhesModal
        isOpen={!!transacaoSelecionada}
        onClose={() => setTransacaoSelecionada(null)}
        transacao={transacaoSelecionada}
        onDeletar={(id) => handleDeletar(id, transacaoSelecionada?.descricao || '')}
      />
    </div>
  );
};