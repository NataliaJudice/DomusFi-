import React from 'react';
import { PessoasManager } from '../components/PessoasManager';

interface PessoasPageProps {
  onVerMaisPessoa: (pessoaId: string) => void;
}

export const PessoasPage: React.FC<PessoasPageProps> = ({ onVerMaisPessoa }) => {
  return <PessoasManager onVerMaisPessoa={onVerMaisPessoa} />;
};