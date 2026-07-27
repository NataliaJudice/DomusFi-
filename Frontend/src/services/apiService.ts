/**
 * Módulo de Integração com a API Backend C# ASP.NET Core (DomusFi API)
 */

import { Pessoa, Transacao, TipoTransacao } from '../types';

const API_URL_KEY = '@domusfi:api_url';
export const DEFAULT_API_URL = 'http://localhost:5190';

export function getApiUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_API_URL;
  const saved = localStorage.getItem(API_URL_KEY);
  return saved ? saved.trim().replace(/\/+$/, '') : DEFAULT_API_URL;
}

export function setApiUrl(url: string): void {
  const formatted = url.trim().replace(/\/+$/, '');
  localStorage.setItem(API_URL_KEY, formatted);
}

export interface PessoaDTO {
  id: string;
  nome: string;
  idade: number;
}

export interface TransacaoResumoDTO {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: string;
  dataTransacao?: string;
  dataCriacao?: string;
}

export interface ResumoPessoaDTO {
  pessoa: PessoaDTO;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  qtdTransacoes: number;
  totalTransacoesFiltradas: number;
  paginaAtual: number;
  totalPaginas: number;
  ultimasTransacoes: TransacaoResumoDTO[];
}

export interface DashboardResumoDTO {
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoLiquidoGeral: number;
  totalPessoas: number;
  totalTransacoes: number;
  qtdMenoresDeIdade: number;
  pessoas: ResumoPessoaDTO[];
}

export interface PessoasResponseDTO {
  idPessoas?: string;
  id?: string;
  nome: string;
  idade: number;
}

export interface PessoasRequestDTO {
  idPessoas?: string;
  nome: string;
  idade: number;
}

export interface TransacoesResponseDTO {
  idTransacoes?: string;
  id?: string;
  descricao: string;
  valor: number;
  tipoDespesa?: string;
  tipoDespesaNome?: string;
  tipo?: string;
  idPessoa?: string;
  pessoaId?: string;
  pessoaNome?: string;
  dataTransacao?: string;
  dataCriacao?: string;
}

export interface TransacoesPaginadasResponseDTO {
  totalRegistros: number;
  paginaAtual: number;
  totalPaginas: number;
  items: TransacoesResponseDTO[];
}

export interface TransacoesRequestDTO {
  descricao: string;
  valor: number;
  tipoDespesa: string;
  idPessoa: string;
  dataTransacao?: string;
}

export interface TipoDespesaDTO {
  id: string;
  nome: string;
}

/* --- DTOs de Relatórios (Direto do Banco C#) --- */

export interface RankingPessoaDTO {
  posicao: number;
  idPessoa: string;
  nome: string;
  idade: number;
  totalValor: number;
  porcentagemParticipacao: number;
  qtdTransacoes: number;
}

export interface RelatorioRankingResponseDTO {
  tipoRelatorio: string;
  dataInicio?: string;
  dataFim?: string;
  totalGeralPeriodo: number;
  ranking: RankingPessoaDTO[];
}

export interface TransacaoItemRelatorioDTO {
  idTransacao: string;
  descricao: string;
  valor: number;
  tipo: string;
  dataTransacao: string;
}

export interface RelatorioPessoaIndividualDTO {
  idPessoa: string;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  transacoes: TransacoesResponseDTO[];
}

export interface RelatorioIndividualResponseDTO {
  dataInicio?: string;
  dataFim?: string;
  pessoas: RelatorioPessoaIndividualDTO[];
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Erro API C# (${response.status}): ${errorText || response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      throw new Error(
        `Não foi possível conectar à API C# em "${baseUrl}". Certifique-se de que a API está rodando.`
      );
    }
    throw err;
  }
}

export const apiService = {
  async testConnection(): Promise<boolean> {
    try {
      await fetchApi<DashboardResumoDTO>('/api/Transacoes/resumo');
      return true;
    } catch {
      return false;
    }
  },

  async obterResumoDashboard(): Promise<DashboardResumoDTO> {
    return await fetchApi<DashboardResumoDTO>('/api/Transacoes/resumo');
  },

 async obterResumoPessoaPaginado(
    idPessoa: string,
    termo: string = '',
    tipo: string = 'todos',
    dataInicio?: string, // Novo
    dataFim?: string,    // Novo
    pagina: number = 1,
    tamanhoPagina: number = 5
  ): Promise<ResumoPessoaDTO> {
    const params = new URLSearchParams({
      termo,
      tipo,
      pagina: String(pagina),
      tamanhoPagina: String(tamanhoPagina),
    });

    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    return await fetchApi<ResumoPessoaDTO>(`/api/Transacoes/pessoa/${idPessoa}?${params.toString()}`);
  },

 async obterTransacoesPaginadas(
    pessoaId: string = 'todas',
    tipo: string = 'todos',
    termo: string = '',
    dataInicio?: string,
    dataFim?: string,
    pagina: number = 1,
    tamanhoPagina: number = 8
  ): Promise<TransacoesPaginadasResponseDTO> {
    const params = new URLSearchParams({
      pessoaId,
      tipo,
      termo,
      pagina: String(pagina),
      tamanhoPagina: String(tamanhoPagina),
    });

    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    return await fetchApi<TransacoesPaginadasResponseDTO>(`/api/Transacoes/paginadas?${params.toString()}`);
  },

  /* --- MÉTODOS DE RELATÓRIOS (CONSULTA DIRETO NO BANCO) --- */

  async obterRelatorioRanking(
    tipo: 'receita' | 'despesa',
    dataInicio?: string,
    dataFim?: string
  ): Promise<RelatorioRankingResponseDTO> {
    const params = new URLSearchParams();
    params.append('tipo', tipo);
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    return await fetchApi<RelatorioRankingResponseDTO>(`/api/Transacoes/ranking?${params.toString()}`);
  },

  async obterRelatorioIndividual(
    idPessoa?: string,
    dataInicio?: string,
    dataFim?: string
  ): Promise<RelatorioIndividualResponseDTO> {
    const params = new URLSearchParams();
    if (idPessoa && idPessoa !== 'todas') params.append('idPessoa', idPessoa);
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    return await fetchApi<RelatorioIndividualResponseDTO>(`/api/Transacoes/individual?${params.toString()}`);
  },

  async obterTiposDespesa(): Promise<TipoDespesaDTO[]> {
    return await fetchApi<TipoDespesaDTO[]>('/api/Transacoes/tipos');
  },

  async obterTodasPessoas(): Promise<Pessoa[]> {
    const data = await fetchApi<PessoasResponseDTO[]>('/api/Pessoas');
    return (data || []).map((p) => ({
      id: p.idPessoas || p.id || '',
      nome: p.nome || '',
      idade: Number(p.idade) || 0,
    }));
  },

  async obterPessoaPorId(id: string): Promise<Pessoa | null> {
    try {
      const p = await fetchApi<PessoasResponseDTO>(`/api/Pessoas/${id}`);
      return {
        id: p.idPessoas || p.id || id,
        nome: p.nome,
        idade: Number(p.idade),
      };
    } catch {
      return null;
    }
  },

  async adicionarPessoa(nome: string, idade: number): Promise<Pessoa> {
    const payload: PessoasRequestDTO = {
      idPessoas: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined,
      nome,
      idade,
    };
    const response = await fetchApi<PessoasResponseDTO>('/api/Pessoas', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: response.idPessoas || response.id || payload.idPessoas || '',
      nome: response.nome || nome,
      idade: Number(response.idade) || idade,
    };
  },

  async atualizarPessoa(id: string, nome: string, idade: number): Promise<void> {
    const payload: PessoasRequestDTO = {
      idPessoas: id,
      nome,
      idade,
    };
    await fetchApi<void>(`/api/Pessoas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deletarPessoa(id: string): Promise<void> {
    await fetchApi<void>(`/api/Pessoas/${id}`, {
      method: 'DELETE',
    });
  },

  async obterTodasTransacoes(): Promise<Transacao[]> {
    const data = await fetchApi<TransacoesResponseDTO[]>('/api/Transacoes');
    return (data || []).map((t) => {
      const tipoStr = (t.tipoDespesa || t.tipo || '').toLowerCase();
      const tipoNormalizado: TipoTransacao = tipoStr.includes('receita') ? 'receita' : 'despesa';

      return {
        id: t.idTransacoes || t.id || '',
        descricao: t.descricao || '',
        valor: Number(t.valor) || 0,
        tipo: tipoNormalizado,
        pessoaId: t.idPessoa || t.pessoaId || '',
        dataTransacao: t.dataTransacao,
        dataCriacao: t.dataTransacao || t.dataCriacao || new Date().toISOString(),
      };
    });
  },

  async adicionarTransacao(
    descricao: string,
    valor: number,
    tipo: TipoTransacao,
    pessoaId: string,
    dataTransacao?: string
  ): Promise<Transacao> {
    const tipoDespesaTexto = tipo === 'receita' ? 'Receita' : 'Despesa';

    const payload: TransacoesRequestDTO = {
      descricao,
      valor,
      tipoDespesa: tipoDespesaTexto,
      idPessoa: pessoaId,
      dataTransacao: dataTransacao || new Date().toISOString(),
    };

    const response = await fetchApi<TransacoesResponseDTO>('/api/Transacoes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: response.idTransacoes || response.id || `t-${Date.now()}`,
      descricao: response.descricao || descricao,
      valor: Number(response.valor) || valor,
      tipo,
      pessoaId: response.idPessoa || pessoaId,
      dataTransacao: response.dataTransacao || payload.dataTransacao,
      dataCriacao: response.dataTransacao || response.dataCriacao || new Date().toISOString(),
    };
  },
};