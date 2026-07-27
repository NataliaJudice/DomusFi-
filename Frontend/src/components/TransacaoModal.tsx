/**
 * Modal de Cadastro de Nova Transação Financeira
 */

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  X,
  AlertCircle,
  AlertTriangle,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinance } from '../context/FinanceContext';
import { TipoTransacao } from '../types';
import { formatarMoeda } from '../utils/formatters';

interface TransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pessoaIdInicial?: string | null;
  bloquearSelecaoPessoa?: boolean;
  onSucesso?: (mensagem: string) => void;
}

export const TransacaoModal: React.FC<TransacaoModalProps> = ({
  isOpen,
  onClose,
  pessoaIdInicial,
  bloquearSelecaoPessoa = false,
  onSucesso,
}) => {
  const { pessoas, adicionarTransacao, obterPessoaPorId } = useFinance();

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('despesa');
  const [dataTransacao, setDataTransacao] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (pessoaIdInicial && pessoas.some((p) => p.id === pessoaIdInicial)) {
        setPessoaId(pessoaIdInicial);
      } else if (pessoas.length > 0) {
        setPessoaId(pessoas[0].id);
      }
      setDescricao('');
      setValor('');
      setTipo('despesa');
      setDataTransacao(new Date().toISOString().split('T')[0]);
      setErro(null);
    }
  }, [isOpen, pessoaIdInicial, pessoas]);

  const pessoaSelecionada = obterPessoaPorId(pessoaId);
  const ehMenor = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  useEffect(() => {
    if (ehMenor) {
      setTipo('despesa');
    }
  }, [pessoaId, ehMenor]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    try {
      const numValor = parseFloat(valor.replace(',', '.'));

      if (!descricao.trim()) {
        setErro('A descrição da transação é obrigatória.');
        return;
      }

      if (isNaN(numValor) || numValor <= 0) {
        setErro('Por favor, informe um valor válido e positivo.');
        return;
      }

      if (!pessoaId) {
        setErro('Selecione a pessoa responsável por esta transação.');
        return;
      }

      if (ehMenor && tipo === 'receita') {
        setErro(
          `A pessoa "${pessoaSelecionada?.nome}" é menor de idade (${pessoaSelecionada?.idade} anos) e só pode registrar DESPESAS.`
        );
        return;
      }

      // Formata a data com o horário zerado: YYYY-MM-DDT00:00:00
      const isoDate = dataTransacao
        ? new Date(`${dataTransacao}T00:00:00`).toISOString()
        : new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

      const novaTransacao = await adicionarTransacao(
        descricao,
        numValor,
        tipo,
        pessoaId,
        isoDate
      );

      if (onSucesso) {
        onSucesso(
          `Transação "${novaTransacao.descricao}" de ${formatarMoeda(
            novaTransacao.valor
          )} salva com sucesso!`
        );
      }

      onClose();
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar transação.');
    }
  };

  const handleCancelar = () => {
    setErro(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 relative overflow-hidden"
        >
          <button
            onClick={handleCancelar}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                Cadastrar Nova Transação
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lançamento de receitas e despesas residenciais.
              </p>
            </div>
          </div>

          {erro && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {pessoas.length === 0 ? (
            <div className="text-center py-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <p className="font-semibold mb-1">Cadastre uma pessoa primeiro</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                É necessário ter ao menos uma pessoa cadastrada para associar a transação.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pessoa Responsável <span className="text-rose-500">*</span>
                  </label>
                  {bloquearSelecaoPessoa && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200/80 dark:border-indigo-800/80">
                      <Lock className="w-3 h-3" /> Pessoa Fixada
                    </span>
                  )}
                </div>

                {bloquearSelecaoPessoa && pessoaSelecionada ? (
                  <div className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      {pessoaSelecionada.nome} ({pessoaSelecionada.idade} anos {ehMenor ? '• Menor' : ''})
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ) : (
                  <select
                    value={pessoaId}
                    onChange={(e) => setPessoaId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  >
                    {pessoas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.idade} anos {p.idade < 18 ? '• Menor de Idade' : ''})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {pessoaSelecionada && ehMenor && (
                <div className="p-3 bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="font-semibold block text-amber-800 dark:text-amber-200">
                      Regra de Menor de Idade Aplicada
                    </strong>
                    <span className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/90">
                      <strong>{pessoaSelecionada.nome}</strong> tem {pessoaSelecionada.idade} anos (&lt; 18). Apenas <strong>DESPESAS</strong> podem ser registradas.
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Transação <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipo('despesa')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      tipo === 'despesa'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    Despesa (Saída)
                  </button>

                  <button
                    type="button"
                    disabled={ehMenor}
                    onClick={() => !ehMenor && setTipo('receita')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      ehMenor
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800'
                        : tipo === 'receita'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {ehMenor ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                    Receita (Entrada)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Descrição <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Mercado, Material Escolar, Salário"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Valor (R$) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                  
                  </span>
                  <input
                    type="text"
                    required
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Data da Transação <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dataTransacao}
                  onChange={(e) => setDataTransacao(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-xs flex items-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Salvar Transação
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};