/**
 * Componente da Sidebar Lateral Retrátil (Drawer Mobile/Tablet)
 */

import React, { useState } from 'react';
import {
  Wallet,
  Users,
  Calculator,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinance } from '../context/FinanceContext';
import { formatarMoeda } from '../utils/formatters';

interface SidebarProps {
  abaAtiva: 'totais' | 'pessoas' | 'transacoes' | 'relatorios';
  setAbaAtiva: (aba: 'totais' | 'pessoas' | 'transacoes' | 'relatorios') => void;
  onNovaPessoaClick: () => void;
  onNovaTransacaoClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  abaAtiva,
  setAbaAtiva,
  onNovaPessoaClick,
  onNovaTransacaoClick,
}) => {
  const { obterResumoGeral, resetarDados } = useFinance();
  const resumoGeral = obterResumoGeral();

  // Estado para controlar abertura no Mobile
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Deseja restaurar os dados de exemplo do sistema?')) {
      resetarDados();
    }
  };

  const handleNavegar = (aba: 'totais' | 'pessoas' | 'transacoes' | 'relatorios') => {
    setAbaAtiva(aba);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* BARRA SUPERIOR FIXA (Visível no Topo do App)            */}
      {/* ======================================================== */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-xs w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Abrir Menu Lateral"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Minimalista (Apenas Ícone + Nome) */}
          <div className="flex items-center gap-2 select-none">
            <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              DomusFi
            </span>
          </div>
        </div>

        {/* Resumo Rápido no Topo */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
            {formatarMoeda(resumoGeral.saldoLiquido)}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* DRAWER SLIDE-IN (Menu Lateral Retrátil)                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop escuro com blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Painel do Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between z-10 border-r border-slate-200 dark:border-slate-800 overflow-y-auto"
            >
              <div>
                {/* Header do Drawer Minimalista */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 select-none">
                    <Wallet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                      DomusFi
                    </span>
                  </div>

                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Resumo Financeiro no Menu */}
                <div className="p-4 m-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Resumo do Sistema
                  </span>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                      Receitas
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatarMoeda(resumoGeral.totalReceitas)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                      Despesas
                    </span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {formatarMoeda(resumoGeral.totalDespesas)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Saldo Líquido</span>
                    <span
                      className={
                        resumoGeral.saldoLiquido >= 0
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }
                    >
                      {formatarMoeda(resumoGeral.saldoLiquido)}
                    </span>
                  </div>
                </div>

                {/* Navegação de Abas */}
                <nav className="px-4 space-y-1.5">
                  <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Navegação
                  </span>

                  <button
                    onClick={() => handleNavegar('totais')}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      abaAtiva === 'totais'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="w-4 h-4" />
                      <span>Consulta de Totais</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        abaAtiva === 'totais'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {resumoGeral.totalPessoas}
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavegar('pessoas')}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      abaAtiva === 'pessoas'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4" />
                      <span>Cadastro de Pessoas</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavegar('transacoes')}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      abaAtiva === 'transacoes'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-4 h-4" />
                      <span>Cadastro de Transações</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        abaAtiva === 'transacoes'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {resumoGeral.totalTransacoes}
                    </span>
                  </button>

                  {/* NOVO BOTÃO: Gerador de Relatórios */}
                  <button
                    onClick={() => handleNavegar('relatorios')}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      abaAtiva === 'relatorios'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      <span>Relatórios Financeiros</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Botão de Reset no Rodapé */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleReset();
                  }}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Dados Demonstrativos
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};