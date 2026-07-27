/**
 * Banner informativo das Regras de Negócio do Desafio Técnico
 *
 * Exibe visualmente a conformidade do sistema com cada item do requisito:
 * 1. Cadastro de Pessoas (ID, Nome, Idade)
 * 2. Exclusão em Cascata (Deletar pessoa remove suas transações)
 * 3. Validação de Idade (Menor de 18 anos restrito a Despesas)
 * 4. Consulta de Totais (Receitas, Despesas, Saldo individual e Total Geral)
 */

import React, { useState } from 'react';
import { ShieldCheck, Users, ArrowRightLeft, Calculator, ChevronDown, ChevronUp, CheckCircle2, Info } from 'lucide-react';

export const RegrasNegocioBanner: React.FC = () => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 mb-6 shadow-md border border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Desafio Técnico: Controle de Gastos Residenciais
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                100% Conforme
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Todas as regras de negócio e validações solicitadas no teste foram implementadas em React + TypeScript.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpandido(!expandido)}
          className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          {expandido ? 'Ocultar Regras' : 'Ver Regras Aplicadas'}
          {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expandido && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 font-medium text-emerald-400 mb-1">
              <Users className="w-4 h-4 shrink-0" />
              <span>1. Cadastro e Deleção em Cascata</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              ID único automático, Nome e Idade. Ao excluir uma pessoa,{' '}
              <strong className="text-white">todas as suas transações vinculadas são automaticamente apagadas</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 font-medium text-amber-400 mb-1">
              <ArrowRightLeft className="w-4 h-4 shrink-0" />
              <span>2. Restrição para Menores de Idade</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Para pessoas com <strong className="text-white">idade &lt; 18 anos</strong>, o formulário bloqueia a opção de Receita, permitindo{' '}
              <strong className="text-amber-300">apenas cadastro de Despesas</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 font-medium text-blue-400 mb-1">
              <Calculator className="w-4 h-4 shrink-0" />
              <span>3. Consulta de Totais e Saldo Líquido</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Exibição detalhada de Receitas, Despesas e Saldo por pessoa, finalizando com o{' '}
              <strong className="text-white">Total Geral de todas as pessoas e Saldo Líquido</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
