import React from 'react';
import { TotaisConsulta } from '../components/TotaisConsulta';

interface TotaisPageProps {
  onNovaTransacaoParaPessoa: (pessoaId: string) => void;
  onIrParaCadastroPessoas: () => void;
  onVerMaisPessoa: (pessoaId: string) => void;
}

export const TotaisPage: React.FC<TotaisPageProps> = ({
  onNovaTransacaoParaPessoa,
  onIrParaCadastroPessoas,
  onVerMaisPessoa,
}) => {
  return (
    <TotaisConsulta
      onNovaTransacaoParaPessoa={onNovaTransacaoParaPessoa}
      onIrParaCadastroPessoas={onIrParaCadastroPessoas}
      onVerMaisPessoa={onVerMaisPessoa}
    />
  );
};