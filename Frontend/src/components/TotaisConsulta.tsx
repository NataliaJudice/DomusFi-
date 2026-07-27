/**
 * Tela de Consulta de Totais (Visão Geral Financeira)

 */

import React, { useState } from 'react';
import {
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatarMoeda, formatarData } from '../utils/formatters';

interface TotaisConsultaProps {
  onNovaTransacaoParaPessoa: (pessoaId: string) => void;
  onIrParaCadastroPessoas: () => void;
  onVerMaisPessoa?: (pessoaId: string) => void;
}

export const TotaisConsulta: React.FC<TotaisConsultaProps> = ({
  onNovaTransacaoParaPessoa,
  onIrParaCadastroPessoas,
  onVerMaisPessoa,
}) => {
  const { obterResumoPessoas, obterResumoGeral, transacoes } = useFinance();
  const [busca, setBusca] = useState('');
  const [pessoaExpandida, setPessoaExpandida] = useState<string | null>(null);

  const resumosPessoas = obterResumoPessoas();
  const resumoGeral = obterResumoGeral();

  // Filtragem por busca por nome de pessoa
  const resumosFiltrados = resumosPessoas.filter((resumo) =>
    resumo.pessoa.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleExpandir = (id: string) => {
    setPessoaExpandida((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Seção Superior: Banner Geral de Saldo e Indicadores Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Geral de Receitas */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Geral de Receitas
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatarMoeda(resumoGeral.totalReceitas)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
            Soma de entradas de todas as pessoas
          </p>
        </div>

        {/* Card 2: Total Geral de Despesas */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Geral de Despesas
            </span>
            <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {formatarMoeda(resumoGeral.totalDespesas)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            Soma de saídas e gastos familiares
          </p>
        </div>

        {/* Card 3: Saldo Líquido Geral */}
        <div
          className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden ${
            resumoGeral.saldoLiquido >= 0
              ? 'bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-indigo-800'
              : 'bg-gradient-to-br from-rose-900 to-rose-950 text-white border-rose-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Saldo Líquido Geral
            </span>
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <PiggyBank className="w-5 h-5 text-indigo-100" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight">
            {formatarMoeda(resumoGeral.saldoLiquido)}
          </div>
          <div className="mt-2 text-xs text-indigo-200 flex items-center justify-between">
            <span>Receitas menos Despesas</span>
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded-md text-[10px]">
              {resumoGeral.saldoLiquido >= 0 ? 'Superávit' : 'Déficit'}
            </span>
          </div>
        </div>
      </div>

      {/* Título da Tabela de Totais e Busca */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Totais Individuais por Pessoa
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extrato consolidado contendo receitas, despesas e saldo individual de cada membro cadastrado.
            </p>
          </div>
        </div>

        {/* Estado Vazio se não houver pessoas */}
        {resumosPessoas.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Nenhuma pessoa cadastrada no sistema
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Para começar a consultar os totais de receitas e despesas, faça o primeiro cadastro de pessoa.
            </p>
            <button
              onClick={onIrParaCadastroPessoas}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              + Cadastrar Primeira Pessoa
            </button>
          </div>
        ) : resumosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
            Nenhuma pessoa encontrada com o termo "{busca}".
          </div>
        ) : (
          /* Listagem de Totais por Pessoa */
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {resumosFiltrados.map((resumo) => {
              const ehMenor = resumo.pessoa.idade < 18;
              const estaExpandido = pessoaExpandida === resumo.pessoa.id;

              const ultimasTransacoesPessoa = (resumo as any).ultimasTransacoes;
              const transacoesDaPessoa = (ultimasTransacoesPessoa && ultimasTransacoesPessoa.length > 0)
                ? ultimasTransacoesPessoa
                : transacoes
                    .filter((t) => String(t.pessoaId || '').toLowerCase() === String(resumo.pessoa.id || '').toLowerCase())
                    .sort((a, b) => new Date((b.dataTransacao || b.dataCriacao) || 0).getTime() - new Date((a.dataTransacao || a.dataCriacao) || 0).getTime());

              const ultimas5Transacoes = transacoesDaPessoa.slice(0, 5);

              return (
                <div
                  key={resumo.pessoa.id}
                  className="py-4 transition-colors rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-700/30 px-2 sm:px-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Informações da Pessoa */}
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onVerMaisPessoa && onVerMaisPessoa(resumo.pessoa.id)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                          ehMenor
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                        }`}
                        title="Ver página individual desta pessoa"
                      >
                        {resumo.pessoa.nome.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onVerMaisPessoa && onVerMaisPessoa(resumo.pessoa.id)}
                            className="font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                            title="Ver perfil e extrato completo"
                          >
                            {resumo.pessoa.nome}
                          </button>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              ehMenor
                                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300/50'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {resumo.pessoa.idade} anos {ehMenor && '(Menor de idade)'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{resumo.qtdTransacoes} transação(ões)</span>
                          {ehMenor && (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium text-[11px]">
                              <AlertCircle className="w-3 h-3" />
                              Apenas despesas permitidas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bloco de Totais (Receitas, Despesas, Saldo) */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-center lg:text-right">
                      {/* Total Receitas */}
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Receitas
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatarMoeda(resumo.totalReceitas)}
                        </span>
                      </div>

                      {/* Total Despesas */}
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Despesas
                        </span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">
                          {formatarMoeda(resumo.totalDespesas)}
                        </span>
                      </div>

                      {/* Saldo Individual */}
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Saldo
                        </span>
                        <span
                          className={`font-bold ${
                            resumo.saldo > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : resumo.saldo < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {formatarMoeda(resumo.saldo)}
                        </span>
                      </div>
                    </div>

                    {/* Ações Rápidas (Apenas Ver Extrato) */}
                    <div className="flex items-center gap-2 justify-end shrink-0">
                      <button
                        onClick={() => toggleExpandir(resumo.pessoa.id)}
                        className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {estaExpandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span>{estaExpandido ? 'Ocultar Detalhes' : 'Ver Extrato'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista resumida (5 mais recentes) quando expandida */}
                  {estaExpandido && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Últimas transações de {resumo.pessoa.nome}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          {transacoesDaPessoa.length} registro(s) no total
                        </span>
                      </div>

                      {transacoesDaPessoa.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2">
                          Nenhuma transação registrada para esta pessoa ainda.
                        </p>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            {ultimas5Transacoes.map((t: any, idx: number) => (
                              <div
                                key={t.id || idx}
                                className="flex items-center justify-between text-xs py-2 px-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                      (t.tipo || '').toLowerCase() === 'receita' ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                  />
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {t.descricao}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {formatarData(t.dataTransacao || t.dataCriacao || '')}
                                  </span>
                                </div>
                                <span
                                  className={`font-semibold ${
                                    (t.tipo || '').toLowerCase() === 'receita'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-rose-600 dark:text-rose-400'
                                  }`}
                                >
                                  {(t.tipo || '').toLowerCase() === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* BOTÃO "VER MAIS..." PARA A PÁGINA INDIVIDUAL DA PESSOA */}
                          <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-700/40 mt-2">
                            <span className="text-[11px] text-slate-400">
                              {transacoesDaPessoa.length > 5
                                ? `Exibindo 5 de ${transacoesDaPessoa.length} lançamentos`
                                : 'Mostrando extrato recente'}
                            </span>
                            {onVerMaisPessoa && (
                              <button
                                onClick={() => onVerMaisPessoa(resumo.pessoa.id)}
                                className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                              >
                                <span>Ver mais</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* RESUMO TOTAL GERAL AO FINAL DA LISTAGEM */}
        {resumosPessoas.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    TOTAL GERAL DE TODAS AS PESSOAS
                  </h3>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {resumoGeral.totalPessoas} pessoas cadastradas ({resumoGeral.qtdMenoresDeIdade} menores de idade)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Geral de Receitas */}
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/70">
                  <span className="text-xs text-slate-400 block mb-1">Total de Receitas</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatarMoeda(resumoGeral.totalReceitas)}
                  </span>
                </div>

                {/* Total Geral de Despesas */}
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/70">
                  <span className="text-xs text-slate-400 block mb-1">Total de Despesas</span>
                  <span className="text-xl font-bold text-rose-400">
                    {formatarMoeda(resumoGeral.totalDespesas)}
                  </span>
                </div>

                {/* Saldo Líquido Geral */}
                <div className="bg-indigo-950/90 p-3.5 rounded-xl border border-indigo-700/60">
                  <span className="text-xs text-indigo-200 block mb-1 font-medium">Saldo Líquido</span>
                  <span
                    className={`text-xl font-black ${
                      resumoGeral.saldoLiquido >= 0 ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {formatarMoeda(resumoGeral.saldoLiquido)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};