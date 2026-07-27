/**
 * Aplicação Principal - Controle de Gastos Residenciais
 */

import React, { useState, useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { PessoaModal } from './components/PessoaModal';
import { TransacaoModal } from './components/TransacaoModal';

import { TotaisPage } from './pages/TotaisPage';
import { PessoasPage } from './pages/PessoasPage';
import { TransacoesPage } from './pages/TransacoesPage';
import { PessoaDetalhesPage } from './pages/PessoaDetalhesPage';
import { RelatoriosManager } from './components/RelatorioManager';

const ABA_KEY = '@domusfi:aba_ativa';
const PESSOA_DETALHES_KEY = '@domusfi:pessoa_detalhes_id';

type AbaTipo = 'totais' | 'pessoas' | 'transacoes' | 'relatorios';

export function AppContent() {
  const [abaAtiva, setAbaAtiva] = useState<AbaTipo>(() => {
    if (typeof window === 'undefined') return 'totais';
    const saved = localStorage.getItem(ABA_KEY);
    return saved === 'pessoas' ||
      saved === 'transacoes' ||
      saved === 'totais' ||
      saved === 'relatorios'
      ? (saved as AbaTipo)
      : 'totais';
  });

  const [pessoaIdPreSelecionada, setPessoaIdPreSelecionada] = useState<string | null>(null);
  const [pessoaDetalhesId, setPessoaDetalhesId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(PESSOA_DETALHES_KEY);
  });

  // Modais Globais
  const [isPessoaModalOpen, setIsPessoaModalOpen] = useState(false);
  const [isTransacaoModalOpen, setIsTransacaoModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(ABA_KEY, abaAtiva);
  }, [abaAtiva]);

  useEffect(() => {
    if (pessoaDetalhesId) {
      localStorage.setItem(PESSOA_DETALHES_KEY, pessoaDetalhesId);
    } else {
      localStorage.removeItem(PESSOA_DETALHES_KEY);
    }
  }, [pessoaDetalhesId]);

  const handleMudarAba = (aba: AbaTipo) => {
    setPessoaDetalhesId(null);
    setAbaAtiva(aba);
  };

  const handleVerMaisPessoa = (pessoaId: string) => {
    setPessoaDetalhesId(pessoaId);
  };

  const handleNovaTransacaoParaPessoa = (pessoaId: string) => {
    setPessoaIdPreSelecionada(pessoaId);
    setIsTransacaoModalOpen(true);
  };

  const handleIrParaCadastroPessoas = () => {
    setPessoaDetalhesId(null);
    setAbaAtiva('pessoas');
    setIsPessoaModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors w-full">
      {/* Header do Topo */}
      <Sidebar
        abaAtiva={abaAtiva}
        setAbaAtiva={handleMudarAba}
        onNovaPessoaClick={() => setIsPessoaModalOpen(true)}
        onNovaTransacaoClick={() => {
          setPessoaIdPreSelecionada(null);
          setIsTransacaoModalOpen(true);
        }}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {pessoaDetalhesId ? (
            <PessoaDetalhesPage
              pessoaId={pessoaDetalhesId}
              onVoltar={() => setPessoaDetalhesId(null)}
              onNovaTransacao={handleNovaTransacaoParaPessoa}
            />
          ) : (
            <>
              {abaAtiva === 'totais' && (
                <TotaisPage
                  onNovaTransacaoParaPessoa={handleNovaTransacaoParaPessoa}
                  onIrParaCadastroPessoas={handleIrParaCadastroPessoas}
                  onVerMaisPessoa={handleVerMaisPessoa}
                />
              )}

              {abaAtiva === 'pessoas' && (
                <PessoasPage onVerMaisPessoa={handleVerMaisPessoa} />
              )}

              {abaAtiva === 'transacoes' && (
                <TransacoesPage
                  pessoaIdPreSelecionada={pessoaIdPreSelecionada}
                  onLimparSelecaoPessoa={() => setPessoaIdPreSelecionada(null)}
                />
              )}

              {abaAtiva === 'relatorios' && <RelatoriosManager />}
            </>
          )}
        </main>
      </div>

      {/* Modais Globais */}
      <PessoaModal
        isOpen={isPessoaModalOpen}
        onClose={() => setIsPessoaModalOpen(false)}
      />

      <TransacaoModal
        isOpen={isTransacaoModalOpen}
        onClose={() => {
          setIsTransacaoModalOpen(false);
          setPessoaIdPreSelecionada(null);
        }}
        pessoaIdInicial={pessoaIdPreSelecionada}
        bloquearSelecaoPessoa={Boolean(pessoaDetalhesId)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}