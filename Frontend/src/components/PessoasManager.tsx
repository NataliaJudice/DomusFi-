/**
 * Componente de Gestão de Pessoas (Listagem Clean com Modal)
 */

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Search,
  CheckCircle2,
  Filter,
  Eye,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ConfirmModal } from './ConfirmModal';
import { PessoaModal } from './PessoaModal';
import { Pessoa } from '../types';

interface PessoasManagerProps {
  onNovaPessoaOpen?: () => void;
  onVerMaisPessoa?: (pessoaId: string) => void;
}

export const PessoasManager: React.FC<PessoasManagerProps> = ({ onVerMaisPessoa }) => {
  const { pessoas, transacoes, deletarPessoa } = useFinance();

  // Estados de Modal e Notificações
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroFaixaEtaria, setFiltroFaixaEtaria] = useState<string>('todas');

  // Modal de Exclusão
  const [pessoaParaDeletar, setPessoaParaDeletar] = useState<Pessoa | null>(null);

  const handleConfirmarDelecao = async () => {
    if (!pessoaParaDeletar) return;

    const resultado = await deletarPessoa(pessoaParaDeletar.id);
    const pessoaDeletada = resultado?.pessoaDeletada;
    const transacoesRemovidasCount = resultado?.transacoesRemovidasCount || 0;

    if (pessoaDeletada) {
      setSucesso(
        `Pessoa "${pessoaDeletada.nome}" excluída.${
          transacoesRemovidasCount > 0
            ? ` ${transacoesRemovidasCount} transação(ões) vinculada(s) também foram apagadas.`
            : ''
        }`
      );
    }

    setPessoaParaDeletar(null);
    setTimeout(() => setSucesso(null), 4000);
  };

  const pessoasFiltradas = pessoas.filter((p) => {
    const termo = busca.trim().toLowerCase();
    const atendeBusca =
      termo === '' ||
      p.nome.toLowerCase().includes(termo) ||
      p.idade.toString().includes(termo);

    const atendeFaixaEtaria =
      filtroFaixaEtaria === 'todas' ||
      (filtroFaixaEtaria === 'maiores' && p.idade >= 18) ||
      (filtroFaixaEtaria === 'menores' && p.idade < 18);

    return atendeBusca && atendeFaixaEtaria;
  });

  return (
    <div className="space-y-6">
      {/* Card Principal */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <span>Membros Cadastrados ({pessoas.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gerencie as pessoas da residência e consulte seus dados.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Cadastrar Nova Pessoa</span>
          </button>
        </div>

        {/* Notificação de Sucesso */}
        {sucesso && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{sucesso}</span>
          </div>
        )}

        {/* Barra de Filtros */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
          {/* Busca por Nome/Idade  */}
          <div className="relative sm:col-span-2 flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar por nome ou idade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ paddingLeft: '38px' }}
              className="w-full pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtro de Faixa Etária */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
            <select
              value={filtroFaixaEtaria}
              onChange={(e) => setFiltroFaixaEtaria(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="todas">Todas as idades</option>
              <option value="maiores">Maiores de idade (18+)</option>
              <option value="menores">Menores de idade (&lt; 18)</option>
            </select>
          </div>
        </div>

        {/* Lista de Cards */}
        {pessoas.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Nenhuma pessoa cadastrada
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Comece adicionando os membros da residência para gerenciar despesas e receitas.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar Primeira Pessoa
            </button>
          </div>
        ) : pessoasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Nenhuma pessoa encontrada para a busca "{busca}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pessoasFiltradas.map((pessoa) => {
              const ehMenor = pessoa.idade < 18;
              const qtdTransacoes = transacoes.filter((t) => t.pessoaId === pessoa.id).length;

              return (
                <div
                  key={pessoa.id}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Lado Esquerdo: Avatar + Nome + Infos */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        ehMenor
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/60'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border dark:border-indigo-800/60'
                      }`}
                    >
                      {pessoa.nome.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {pessoa.nome}
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                            ehMenor
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50 dark:border-amber-800/60'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {pessoa.idade} anos
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                          #{pessoa.id.substring(0, 6)}
                        </span>
                        <span>•</span>
                        <span>{qtdTransacoes} transação(ões)</span>
                      </div>
                    </div>
                  </div>

                  {/* Lado Direito: Ações */}
                  <div className="flex items-center gap-1 shrink-0">
                    {onVerMaisPessoa && (
                      <button
                        onClick={() => onVerMaisPessoa(pessoa.id)}
                        className="px-2.5 py-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Ver perfil e extrato completo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Extrato</span>
                      </button>
                    )}

                    <button
                      onClick={() => setPessoaParaDeletar(pessoa)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium cursor-pointer"
                      title="Excluir pessoa"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Excluir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Cadastro de Pessoa */}
      <PessoaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSucesso={(msg) => {
          setSucesso(msg);
          setTimeout(() => setSucesso(null), 4000);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={!!pessoaParaDeletar}
        titulo="Excluir Pessoa"
        mensagem={`Tem certeza que deseja excluir "${pessoaParaDeletar?.nome}"?`}
        alertaAdicional={
          pessoaParaDeletar
            ? `ATENÇÃO: Ao excluir esta pessoa, todas as ${
                transacoes.filter((t) => t.pessoaId === pessoaParaDeletar.id).length
              } transações associadas a ela serão permanentemente apagadas.`
            : undefined
        }
        textoConfirmar="Excluir Pessoa e Transações"
        onConfirm={handleConfirmarDelecao}
        onCancel={() => setPessoaParaDeletar(null)}
      />
    </div>
  );
};