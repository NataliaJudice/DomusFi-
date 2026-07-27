/**
 * Contexto e Gerenciador de Estado Financeiro
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Pessoa, Transacao, TipoTransacao, ResumoPessoa, ResumoGeral } from '../types';
import {
  apiService,
  getApiUrl,
  setApiUrl,
  DashboardResumoDTO,
} from '../services/apiService';
import {
  carregarPessoas,
  salvarPessoas,
  carregarTransacoes,
  salvarTransacoes,
  resetarParaDadosIniciais,
} from '../services/storage';

interface ContextoFinanceiroType {
  pessoas: Pessoa[];
  transacoes: Transacao[];
  
  apiConectada: boolean;
  apiCarregando: boolean;
  apiUrl: string;
  apiError: string | null;
  dashboardResumoApi: DashboardResumoDTO | null;
  alterarApiUrl: (novaUrl: string) => Promise<boolean>;
  recarregarDadosApi: () => Promise<void>;

  adicionarPessoa: (nome: string, idade: number) => Promise<Pessoa>;
  deletarPessoa: (id: string) => Promise<{ pessoaDeletada: Pessoa | null; transacoesRemovidasCount: number }>;
  
  adicionarTransacao: (
    descricao: string,
    valor: number,
    tipo: TipoTransacao,
    pessoaId: string,
    dataTransacao?: string
  ) => Promise<Transacao>;
  deletarTransacao: (id: string) => Promise<void>;
  
  obterPessoaPorId: (id: string) => Pessoa | undefined;
  ehMenorDeIdade: (pessoaId: string) => boolean;
  obterResumoPessoas: () => ResumoPessoa[];
  obterResumoPessoa: (pessoaId: string) => ResumoPessoa | undefined;
  obterResumoGeral: () => ResumoGeral;
  
  resetarDados: () => void;
}

const ContextoFinanceiro = createContext<ContextoFinanceiroType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregado, setCarregado] = useState(false);

  const [apiConectada, setApiConectada] = useState(false);
  const [apiCarregando, setApiCarregando] = useState(true);
  const [apiUrl, setApiUrlState] = useState<string>(getApiUrl());
  const [apiError, setApiError] = useState<string | null>(null);
  const [dashboardResumoApi, setDashboardResumoApi] = useState<DashboardResumoDTO | null>(null);

  const recarregarDadosApi = useCallback(async () => {
    setApiCarregando(true);
    setApiError(null);

    try {
      const resumo = await apiService.obterResumoDashboard();
      setDashboardResumoApi(resumo);

      const [pessoasApi, transacoesApi] = await Promise.all([
        apiService.obterTodasPessoas().catch(() => []),
        apiService.obterTodasTransacoes().catch(() => []),
      ]);

      if (resumo?.pessoas && resumo.pessoas.length > 0) {
        const pessoasDoResumo: Pessoa[] = resumo.pessoas.map((p) => ({
          id: p.pessoa?.id || '',
          nome: p.pessoa?.nome || '',
          idade: p.pessoa?.idade || 0,
        })).filter(p => p.id && p.nome);

        const listaFinalPessoas = pessoasApi.length > 0 ? pessoasApi : pessoasDoResumo;
        if (listaFinalPessoas.length > 0) setPessoas(listaFinalPessoas);
      } else if (pessoasApi.length > 0) {
        setPessoas(pessoasApi);
      }

      if (transacoesApi.length > 0) {
        setTransacoes(transacoesApi);
      }

      setApiConectada(true);
    } catch (err: any) {
      console.warn('Conexão com API C# não estabelecida:', err.message);
      setApiConectada(false);
      setApiError(err.message || 'Falha ao conectar com a API C#.');

      const pessoasSalvas = carregarPessoas();
      const transacoesSalvas = carregarTransacoes();
      if (pessoasSalvas.length > 0) setPessoas(pessoasSalvas);
      if (transacoesSalvas.length > 0) setTransacoes(transacoesSalvas);
    } finally {
      setApiCarregando(false);
      setCarregado(true);
    }
  }, []);

  useEffect(() => {
    recarregarDadosApi();
  }, [recarregarDadosApi]);

  useEffect(() => {
    if (carregado) {
      salvarPessoas(pessoas);
    }
  }, [pessoas, carregado]);

  useEffect(() => {
    if (carregado) {
      salvarTransacoes(transacoes);
    }
  }, [transacoes, carregado]);

  const alterarApiUrl = async (novaUrl: string): Promise<boolean> => {
    setApiUrl(novaUrl);
    setApiUrlState(getApiUrl());
    await recarregarDadosApi();
    return apiConectada;
  };

  const obterPessoaPorId = (id: string): Pessoa | undefined => {
    return pessoas.find((p) => String(p.id || '').toLowerCase() === String(id || '').toLowerCase());
  };

  const ehMenorDeIdade = (pessoaId: string): boolean => {
    const pessoa = obterPessoaPorId(pessoaId);
    return pessoa ? pessoa.idade < 18 : false;
  };

  const adicionarPessoa = async (nome: string, idade: number): Promise<Pessoa> => {
    const nomeFormatado = nome.trim();
    if (!nomeFormatado) {
      throw new Error('O nome da pessoa é obrigatório.');
    }
    if (isNaN(idade) || idade < 0 || idade > 130) {
      throw new Error('Por favor, informe uma idade válida (0 a 130 anos).');
    }

    if (apiConectada) {
      try {
        const pessoaCriada = await apiService.adicionarPessoa(nomeFormatado, Math.floor(idade));
        setPessoas((prev) => [pessoaCriada, ...prev]);
        const novoResumo = await apiService.obterResumoDashboard().catch(() => null);
        if (novoResumo) setDashboardResumoApi(novoResumo);
        return pessoaCriada;
      } catch (err: any) {
        console.error('Erro ao adicionar pessoa na API C#:', err);
        throw new Error(err.message || 'Falha ao salvar pessoa na API.');
      }
    }

    const novaPessoa: Pessoa = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nome: nomeFormatado,
      idade: Math.floor(idade),
    };

    setPessoas((prev) => [novaPessoa, ...prev]);
    return novaPessoa;
  };

  const deletarPessoa = async (id: string) => {
    const pessoaParaDeletar = pessoas.find((p) => p.id === id) || null;
    const transacoesDaPessoa = transacoes.filter((t) => t.pessoaId === id);
    const transacoesRemovidasCount = transacoesDaPessoa.length;

    if (apiConectada) {
      try {
        await apiService.deletarPessoa(id);
        const novoResumo = await apiService.obterResumoDashboard().catch(() => null);
        if (novoResumo) setDashboardResumoApi(novoResumo);
      } catch (err: any) {
        console.error('Erro ao deletar pessoa na API C#:', err);
      }
    }

    setPessoas((prev) => prev.filter((p) => p.id !== id));
    setTransacoes((prev) => prev.filter((t) => t.pessoaId !== id));

    return {
      pessoaDeletada: pessoaParaDeletar,
      transacoesRemovidasCount,
    };
  };

  const adicionarTransacao = async (
    descricao: string,
    valor: number,
    tipo: TipoTransacao,
    pessoaId: string,
    dataTransacao?: string
  ): Promise<Transacao> => {
    const descFormatada = descricao.trim();
    if (!descFormatada) {
      throw new Error('A descrição da transação é obrigatória.');
    }

    if (isNaN(valor) || valor <= 0) {
      throw new Error('O valor da transação deve ser um número positivo maior que zero.');
    }

    const pessoaExistente = pessoas.find((p) => p.id === pessoaId);
    if (!pessoaExistente) {
      throw new Error('A pessoa selecionada não existe no cadastro.');
    }

    if (pessoaExistente.idade < 18 && tipo === 'receita') {
      throw new Error(
        `A pessoa "${pessoaExistente.nome}" possui ${pessoaExistente.idade} anos (menor de 18 anos) e só pode ter transações do tipo DESPESA.`
      );
    }

    if (apiConectada) {
      try {
        const transacaoCriada = await apiService.adicionarTransacao(
          descFormatada,
          Number(valor.toFixed(2)),
          tipo,
          pessoaId,
          dataTransacao
        );
        setTransacoes((prev) => [transacaoCriada, ...prev]);
        
        const novoResumo = await apiService.obterResumoDashboard().catch(() => null);
        if (novoResumo) setDashboardResumoApi(novoResumo);

        return transacaoCriada;
      } catch (err: any) {
        console.error('Erro ao cadastrar transação na API C#:', err);
        throw new Error(err.message || 'Falha ao salvar transação na API.');
      }
    }

    const novaTransacao: Transacao = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `t-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      descricao: descFormatada,
      valor: Number(valor.toFixed(2)),
      tipo,
      pessoaId,
      dataTransacao: dataTransacao || new Date().toISOString(),
      dataCriacao: new Date().toISOString(),
    };

    setTransacoes((prev) => [novaTransacao, ...prev]);
    return novaTransacao;
  };

  const deletarTransacao = async (id: string) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
    if (apiConectada) {
      const novoResumo = await apiService.obterResumoDashboard().catch(() => null);
      if (novoResumo) setDashboardResumoApi(novoResumo);
    }
  };

  const obterResumoPessoa = (pessoaId: string): ResumoPessoa | undefined => {
    const idBusca = String(pessoaId || '').trim().toLowerCase();

    if (!idBusca) return undefined;

    if (dashboardResumoApi?.pessoas) {
      const pessoaResumoApi = dashboardResumoApi.pessoas.find(
        (p) => String(p.pessoa?.id || '').trim().toLowerCase() === idBusca
      );
      if (pessoaResumoApi) {
        return {
          pessoa: {
            id: pessoaResumoApi.pessoa.id,
            nome: pessoaResumoApi.pessoa.nome,
            idade: pessoaResumoApi.pessoa.idade,
          },
          totalReceitas: pessoaResumoApi.totalReceitas,
          totalDespesas: pessoaResumoApi.totalDespesas,
          saldo: pessoaResumoApi.saldo,
          qtdTransacoes: pessoaResumoApi.qtdTransacoes,
          ...(pessoaResumoApi.ultimasTransacoes ? { ultimasTransacoes: pessoaResumoApi.ultimasTransacoes as any } : {}),
        };
      }
    }

    const pessoa = pessoas.find((p) => String(p.id || '').trim().toLowerCase() === idBusca);
    if (!pessoa) return undefined;

    const transacoesPessoa = transacoes.filter((t) => String(t.pessoaId || '').trim().toLowerCase() === idBusca);

    const totalReceitas = transacoesPessoa
      .filter((t) => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);

    const totalDespesas = transacoesPessoa
      .filter((t) => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    return {
      pessoa,
      totalReceitas: Number(totalReceitas.toFixed(2)),
      totalDespesas: Number(totalDespesas.toFixed(2)),
      saldo: Number(saldo.toFixed(2)),
      qtdTransacoes: transacoesPessoa.length,
      ...(transacoesPessoa.length > 0 ? { ultimasTransacoes: transacoesPessoa.slice(0, 5) as any } : {}),
    };
  };

  const obterResumoPessoas = (): ResumoPessoa[] => {
    if (dashboardResumoApi?.pessoas && dashboardResumoApi.pessoas.length > 0) {
      return dashboardResumoApi.pessoas.map((item) => {
        const resumoCompleto = obterResumoPessoa(item.pessoa?.id || '');
        return resumoCompleto || {
          pessoa: {
            id: item.pessoa?.id || '',
            nome: item.pessoa?.nome || '',
            idade: item.pessoa?.idade || 0,
          },
          totalReceitas: item.totalReceitas,
          totalDespesas: item.totalDespesas,
          saldo: item.saldo,
          qtdTransacoes: item.qtdTransacoes,
        };
      });
    }

    return pessoas.map((pessoa) => {
      const resumo = obterResumoPessoa(pessoa.id);
      return resumo || { pessoa, totalReceitas: 0, totalDespesas: 0, saldo: 0, qtdTransacoes: 0 };
    });
  };

  const obterResumoGeral = (): ResumoGeral => {
    if (dashboardResumoApi) {
      return {
        totalReceitas: dashboardResumoApi.totalReceitasGeral,
        totalDespesas: dashboardResumoApi.totalDespesasGeral,
        saldoLiquido: dashboardResumoApi.saldoLiquidoGeral,
        totalPessoas: dashboardResumoApi.totalPessoas,
        totalTransacoes: dashboardResumoApi.totalTransacoes,
        qtdMenoresDeIdade: dashboardResumoApi.qtdMenoresDeIdade,
      };
    }

    const totalReceitas = transacoes
      .filter((t) => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);

    const totalDespesas = transacoes
      .filter((t) => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);

    const saldoLiquido = totalReceitas - totalDespesas;
    const qtdMenores = pessoas.filter((p) => p.idade < 18).length;

    return {
      totalReceitas: Number(totalReceitas.toFixed(2)),
      totalDespesas: Number(totalDespesas.toFixed(2)),
      saldoLiquido: Number(saldoLiquido.toFixed(2)),
      totalPessoas: pessoas.length,
      totalTransacoes: transacoes.length,
      qtdMenoresDeIdade: qtdMenores,
    };
  };

  const resetarDados = () => {
    const { pessoas: pInicial, transacoes: tInicial } = resetarParaDadosIniciais();
    setPessoas(pInicial);
    setTransacoes(tInicial);
    setDashboardResumoApi(null);
  };

  return (
    <ContextoFinanceiro.Provider
      value={{
        pessoas,
        transacoes,
        apiConectada,
        apiCarregando,
        apiUrl,
        apiError,
        dashboardResumoApi,
        alterarApiUrl,
        recarregarDadosApi,
        adicionarPessoa,
        deletarPessoa,
        adicionarTransacao,
        deletarTransacao,
        obterPessoaPorId,
        ehMenorDeIdade,
        obterResumoPessoas,
        obterResumoPessoa,
        obterResumoGeral,
        resetarDados,
      }}
    >
      {children}
    </ContextoFinanceiro.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(ContextoFinanceiro);
  if (!context) {
    throw new Error('useFinance deve ser utilizado dentro de um FinanceProvider');
  }
  return context;
};