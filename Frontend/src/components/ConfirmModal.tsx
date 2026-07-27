/**
 * Componente Reutilizável de Modal de Confirmação de Exclusão
 */

import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmModalProps {
  isOpen: boolean;
  titulo: string;
  mensagem: string;
  alertaAdicional?: string;
  textoConfirmar?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  titulo,
  mensagem,
  alertaAdicional,
  textoConfirmar = 'Sim, Excluir',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

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
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {titulo}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {mensagem}
              </p>
            </div>
          </div>

          {alertaAdicional && (
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{alertaAdicional}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 shadow-xs flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {textoConfirmar}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
