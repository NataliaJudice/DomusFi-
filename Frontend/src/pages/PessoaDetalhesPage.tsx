import React from 'react';
import { PessoaDetalhesView } from '../components/PessoaDetalhesView';

interface PessoaDetalhesPageProps {
  pessoaId: string;
  onVoltar: () => void;
  onNovaTransacao: (pessoaId: string) => void;
}

export const PessoaDetalhesPage: React.FC<PessoaDetalhesPageProps> = ({
  pessoaId,
  onVoltar,
  onNovaTransacao,
}) => {
  return (
    <PessoaDetalhesView
      pessoaId={pessoaId}
      onVoltar={onVoltar}
      onNovaTransacao={onNovaTransacao}
    />
  );
};