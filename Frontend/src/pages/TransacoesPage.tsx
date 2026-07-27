import React from 'react';
import { TransacoesManager } from '../components/TransacoesManager';

interface TransacoesPageProps {
  pessoaIdPreSelecionada: string | null;
  onLimparSelecaoPessoa: () => void;
}

export const TransacoesPage: React.FC<TransacoesPageProps> = ({
  pessoaIdPreSelecionada,
  onLimparSelecaoPessoa,
}) => {
  return (
    <TransacoesManager
      pessoaIdPreSelecionada={pessoaIdPreSelecionada}
      onLimparSelecaoPessoa={onLimparSelecaoPessoa}
    />
  );
};