/**
 * Componente de Gestão de Transações (Consumindo API C# com Filtros, Período e Paginação)
 *
 * Atende aos requisitos do Desafio Técnico:
 * 1. Deleção e listagem de transações com requisição paginada do backend.
 * 2. REGRA DO MENOR DE IDADE no Modal de Cadastro.
 * 3. Modal Detalhada ao clicar nos cards de transação.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  User,
  CheckCircle2,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Calendar,
  X,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransacaoModal } from './TransacaoModal';
import { TransacaoDetalhesModal } from './TransacaoDetalhesModal';
import { formatarMoeda, formatarData } from '../utils/formatters';
import { apiService, TransacoesPaginadasResponseDTO } from '../services/apiService';

interface TransacoesManagerProps {
  pessoaIdPreSelecionada?: string | null;
  onLimparSelecaoPessoa?: () => void;
}

export const TransacoesManager: React.FC<TransacoesManagerProps> = ({
  pessoaIdPreSelecionada,
  onLimparSelecaoPessoa,
}) => {
  const { pessoas, deletarTransacao } = useFinance();

  // Estados de Modal de Cadastro, Detalhes e Notificação
  const [isModalOpen, setIsModalOpen] = useState(!!pessoaIdPreSelecionada);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<any | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);

  // Estados de Filtros, Período e Paginação
  const [filtroPessoa, setFiltroPessoa] = useState<string>(pessoaIdPreSelecionada || 'todas');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [buscaDescricao, setBuscaDescricao] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [pagina, setPagina] = useState<number>(1);
  const tamanhoPagina = 8;

  // Estado dos Dados Paginados do Backend
  const [dadosPaginados, setDadosPaginados] = useState<TransacoesPaginadasResponseDTO | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Carrega as transações paginadas via API Service com suporte a datas
  const carregarTransacoes = useCallback(async () => {
    setCarregando(true);
    setErroApi(null);
    try {
      const data = await apiService.obterTransacoesPaginadas(
        filtroPessoa,
        filtroTipo,
        buscaDescricao,
        dataInicio || undefined,
        dataFim || undefined,
        pagina,
        tamanhoPagina
      );
      setDadosPaginados(data);
    } catch (err: any) {
      setErroApi(err.message || 'Erro ao carregar histórico de transações da API.');
    } finally {
      setCarregando(false);
    }
  }, [filtroPessoa, filtroTipo, buscaDescricao, dataInicio, dataFim, pagina]);

  useEffect(() => {
    carregarTransacoes();
  }, [carregarTransacoes]);

  // Handlers
  const handlePessoaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroPessoa(e.target.value);
    setPagina(1);
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroTipo(e.target.value);
    setPagina(1);
  };

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuscaDescricao(e.target.value);
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

  const limparDatas = () => {
    setDataInicio('');
    setDataFim('');
    setPagina(1);
  };

  const handleDeletar = async (transacaoId: string) => {
    try {
      await deletarTransacao(transacaoId);
      setSucesso('Transação excluída com sucesso!');
      setTimeout(() => setSucesso(null), 3500);
      carregarTransacoes();
    } catch (err: any) {
      setErroApi(err.message || 'Erro ao excluir transação.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Card Principal de Transações */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {/* Cabeçalho do Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Wallet className="w-5 h-5" />
              </div>
              <span>Histórico de Transações ({dadosPaginados?.totalRegistros ?? 0})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Clique sobre uma transação para visualizar detalhes completos.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Cadastrar Nova Transação</span>
          </button>
        </div>

        {/* Notificações */}
        {sucesso && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{sucesso}</span>
          </div>
        )}

        {erroApi && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{erroApi}</span>
          </div>
        )}

        {/* Barra de Filtros */}
        <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Buscar por descrição..."
                value={buscaDescricao}
                onChange={handleBuscaChange}
                style={{ paddingLeft: '38px' }}
                className="w-full pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
              <select
                value={filtroPessoa}
                onChange={handlePessoaChange}
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="todas">Todas as pessoas</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
              <select
                value={filtroTipo}
                onChange={handleTipoChange}
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="todos">Todos os tipos</option>
                <option value="receita">Apenas Receitas (+)</option>
                <option value="despesa">Apenas Despesas (-)</option>
              </select>
            </div>
          </div>

          {/* Filtros de Período (Data Inicial e Final) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 items-center">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Início:</span>
              <div className="relative w-full">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={dataInicio}
                  onChange={handleDataInicioChange}
                  style={{ paddingLeft: '34px' }}
                  className="w-full pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Fim:</span>
              <div className="relative w-full">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={dataFim}
                  onChange={handleDataFimChange}
                  style={{ paddingLeft: '34px' }}
                  className="w-full pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {(dataInicio || dataFim) && (
              <div className="flex justify-end lg:justify-start">
                <button
                  onClick={limparDatas}
                  className="px-3 py-2 bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpar Datas</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Transações */}
        {carregando ? (
          <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span>Carregando transações da API...</span>
          </div>
        ) : !dadosPaginados || dadosPaginados.items.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Nenhuma transação encontrada
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Nenhum lançamento corresponde aos filtros e período selecionados.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Cadastrar Nova Transação
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {dadosPaginados.items.map((t) => {
                const idTransacao = t.idTransacoes || t.id || '';
                const pessoaNomeExibicao =
                  t.pessoaNome ||
                  pessoas.find((p) => p.id === (t.idPessoa || t.pessoaId))?.nome ||
                  'Pessoa Registrada';
                const tipoStr = (t.tipoDespesa || t.tipo || '').toLowerCase();
                const ehReceita = tipoStr.includes('receita');

                return (
                  <div
                    key={idTransacao}
                    onClick={() =>
                      setTransacaoSelecionada({
                        ...t,
                        pessoaNome: pessoaNomeExibicao,
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
                          <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <User className="w-3 h-3 text-indigo-500" />
                            {pessoaNomeExibicao}
                          </span>
                          <span>•</span>
                          <span>
                            {formatarData((t.dataTransacao || t.dataCriacao || '').split('T')[0])}
                          </span>
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
                        <span className="text-[10px] text-slate-400 capitalize">
                          {ehReceita ? 'Receita' : 'Despesa'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONTROLES DE PAGINAÇÃO */}
            {dadosPaginados.totalPaginas > 1 && (
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Página <strong>{dadosPaginados.paginaAtual}</strong> de{' '}
                  <strong>{dadosPaginados.totalPaginas}</strong> ({dadosPaginados.totalRegistros} registros)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                    disabled={dadosPaginados.paginaAtual <= 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Página Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPagina((prev) => Math.min(prev + 1, dadosPaginados.totalPaginas))}
                    disabled={dadosPaginados.paginaAtual >= dadosPaginados.totalPaginas}
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
        onDeletar={handleDeletar}
      />

      {/* Modal de Cadastro de Transação */}
      <TransacaoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onLimparSelecaoPessoa) onLimparSelecaoPessoa();
        }}
        pessoaIdInicial={pessoaIdPreSelecionada}
        onSucesso={(msg) => {
          setSucesso(msg);
          setTimeout(() => setSucesso(null), 4000);
          carregarTransacoes();
        }}
      />
    </div>
  );
};