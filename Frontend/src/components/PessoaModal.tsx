/**
 * Modal de Cadastro de Nova Pessoa
 */

import React, { useState } from 'react';
import { UserPlus, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinance } from '../context/FinanceContext';

interface PessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSucesso?: (mensagem: string) => void;
}

export const PessoaModal: React.FC<PessoaModalProps> = ({ isOpen, onClose, onSucesso }) => {
  const { adicionarPessoa } = useFinance();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    try {
      const numIdade = parseInt(idade, 10);
      if (!nome.trim()) {
        setErro('O nome da pessoa é obrigatório.');
        return;
      }
      if (isNaN(numIdade) || numIdade < 0 || numIdade > 130) {
        setErro('Informe uma idade válida (entre 0 e 130 anos).');
        return;
      }

      const novaPessoa = await adicionarPessoa(nome, numIdade);
      if (onSucesso) {
        onSucesso(`Pessoa "${novaPessoa.nome}" cadastrada com sucesso!`);
      }

      setNome('');
      setIdade('');
      onClose();
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar pessoa.');
    }
  };

  const handleCancelar = () => {
    setErro(null);
    setNome('');
    setIdade('');
    onClose();
  };

  const numIdadeDigitado = parseInt(idade, 10);
  const ehMenorDigitado = !isNaN(numIdadeDigitado) && numIdadeDigitado < 18;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 relative overflow-hidden"
        >
          {/* Botão de Fechar */}
          <button
            onClick={handleCancelar}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cabeçalho do Modal */}
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Cadastrar Nova Pessoa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adicione um membro com ID automático ao sistema.
              </p>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos Silva"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Idade (anos) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                max="130"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="Ex: 28 ou 15"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {ehMenorDigitado && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  Menor de idade (&lt; 18 anos): esta pessoa poderá ter apenas despesas.
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-6">
              <button
                type="button"
                onClick={handleCancelar}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Cadastrar Pessoa
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};