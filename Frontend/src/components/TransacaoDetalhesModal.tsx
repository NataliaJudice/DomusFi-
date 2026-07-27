import React from 'react';
import {
  X,
  Wallet,
  User,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatarMoeda, formatarData } from '../utils/formatters';

interface TransacaoDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  transacao: any | null;
  onDeletar?: (id: string) => void;
}

export const TransacaoDetalhesModal: React.FC<TransacaoDetalhesModalProps> = ({
  isOpen,
  onClose,
  transacao,
}) => {
  if (!transacao) return null;

  const tipoStr = (transacao.tipoDespesa || transacao.tipo || '').toLowerCase();
  const ehReceita = tipoStr.includes('receita');

  // Cores dinâmicas para a borda do valor
  const corBorda = ehReceita ? '#10b981' : '#f43f5e'; // Emerald-500 / Rose-500

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay com Animação de Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Card com Animação de Entrada/Saída (Scale, Fade & Pop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-10 transition-colors"
            style={{ border: '1px solid rgba(30, 41, 59, 0.8)' }}
          >
            {/* Cabeçalho */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.8)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-950/80 rounded-xl text-indigo-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  Detalhes da Transação
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Card do Valor */}
              <div
                className={`p-4 rounded-xl flex items-center justify-between ${
                  ehReceita
                    ? 'bg-emerald-950/20 text-emerald-400'
                    : 'bg-rose-950/20 text-rose-400'
                }`}
                style={{ border: `1.5px solid ${corBorda}` }}
              >
                <div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase opacity-80 block">
                    {ehReceita ? 'Receita Total' : 'Despesa Total'}
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight">
                    {ehReceita ? '+' : '-'} {formatarMoeda(transacao.valor)}
                  </span>
                </div>

                {/* Ícone */}
                <div
                  className={`p-3 rounded-xl ${
                    ehReceita
                      ? 'bg-emerald-950/60 text-emerald-400'
                      : 'bg-rose-950/60 text-rose-400'
                  }`}
                  style={{ border: `1.5px solid ${corBorda}` }}
                >
                  {ehReceita ? (
                    <ArrowUpRight className="w-6 h-6" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6" />
                  )}
                </div>
              </div>

              {/* Grid de Informações Básicas */}
              <div className="space-y-4 text-xs">
                {/* Descrição */}
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-400 font-medium block">Descrição</span>
                    <span className="text-slate-100 font-semibold text-sm">
                      {transacao.descricao || 'Sem descrição'}
                    </span>
                  </div>
                </div>

                {/* Pessoa Responsável */}
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-400 font-medium block">Pessoa Responsável</span>
                    <span className="text-slate-200 font-medium">
                      {transacao.pessoaNome || 'Não especificada'}
                    </span>
                  </div>
                </div>

                {/* Data da Transação */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-400 font-medium block">Data da Transação</span>
                    <span className="text-slate-200 font-medium">
                      {formatarData(
                        transacao.dataTransacao ||
                          transacao.dataCriacao ||
                          transacao.data ||
                          ''
                      )}
                    </span>
                  </div>
                </div>

                {/* Tipo / Categoria */}
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-400 font-medium block">Tipo da Transação</span>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-slate-800 text-slate-300">
                      {transacao.tipoDespesa || transacao.tipo || 'Desconhecido'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};