/**
 * Módulo de Armazenamento e Persistência de Dados (LocalStorage)
 *
 * Garante que os dados de Pessoas e Transações permaneçam salvos
 * no navegador após fechar a aplicação, conforme requisito do desafio.
 */

import { Pessoa, Transacao } from '../types';

const STORAGE_KEY_PESSOAS = '@controle_gastos:pessoas_v1';
const STORAGE_KEY_TRANSACOES = '@controle_gastos:transacoes_v1';

/**
 * Dados iniciais demonstrativos para apresentar o sistema com informações reais.
 * Inclui adultos e menores de idade para demonstrar a regra de negócio.
 */
const DADOS_INICIAIS_PESSOAS: Pessoa[] = [
  { id: 'p-1', nome: 'Carlos Silva', idade: 38 },
  { id: 'p-2', nome: 'Mariana Santos', idade: 29 },
  { id: 'p-3', nome: 'Lucas Oliveira', idade: 15 }, // Menor de idade (< 18)
  { id: 'p-4', nome: 'Beatriz Costa', idade: 12 }, // Menor de idade (< 18)
];

const DADOS_INICIAIS_TRANSACOES: Transacao[] = [
  {
    id: 't-1',
    descricao: 'Salário Mensal',
    valor: 7500.0,
    tipo: 'receita',
    pessoaId: 'p-1',
    dataCriacao: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 't-2',
    descricao: 'Supermercado da Família',
    valor: 1250.4,
    tipo: 'despesa',
    pessoaId: 'p-1',
    dataCriacao: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 't-3',
    descricao: 'Projeto Freelance UX',
    valor: 3200.0,
    tipo: 'receita',
    pessoaId: 'p-2',
    dataCriacao: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 't-4',
    descricao: 'Academia e Saúde',
    valor: 180.0,
    tipo: 'despesa',
    pessoaId: 'p-2',
    dataCriacao: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 't-5',
    descricao: 'Lanche na Escola',
    valor: 45.0,
    tipo: 'despesa',
    pessoaId: 'p-3', // Menor de idade (Apenas despesa)
    dataCriacao: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 't-6',
    descricao: 'Curso de Inglês Teen',
    valor: 220.0,
    tipo: 'despesa',
    pessoaId: 'p-3', // Menor de idade (Apenas despesa)
    dataCriacao: new Date().toISOString(),
  },
  {
    id: 't-7',
    descricao: 'Material Escolar e Livros',
    valor: 115.5,
    tipo: 'despesa',
    pessoaId: 'p-4', // Menor de idade (Apenas despesa)
    dataCriacao: new Date().toISOString(),
  },
];

/**
 * Carrega a lista de pessoas salvas no LocalStorage.
 * Se não houver dados gravados, inicializa com a massa de dados padrão.
 */
export function carregarPessoas(): Pessoa[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PESSOAS);
    if (!data) {
      salvarPessoas(DADOS_INICIAIS_PESSOAS);
      return DADOS_INICIAIS_PESSOAS;
    }
    return JSON.parse(data) as Pessoa[];
  } catch (error) {
    console.error('Erro ao carregar pessoas do LocalStorage:', error);
    return DADOS_INICIAIS_PESSOAS;
  }
}

/**
 * Salva a lista atualizada de pessoas no LocalStorage.
 */
export function salvarPessoas(pessoas: Pessoa[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PESSOAS, JSON.stringify(pessoas));
  } catch (error) {
    console.error('Erro ao salvar pessoas no LocalStorage:', error);
  }
}

/**
 * Carrega a lista de transações salvas no LocalStorage.
 */
export function carregarTransacoes(): Transacao[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TRANSACOES);
    if (!data) {
      salvarTransacoes(DADOS_INICIAIS_TRANSACOES);
      return DADOS_INICIAIS_TRANSACOES;
    }
    return JSON.parse(data) as Transacao[];
  } catch (error) {
    console.error('Erro ao carregar transações do LocalStorage:', error);
    return DADOS_INICIAIS_TRANSACOES;
  }
}

/**
 * Salva a lista atualizada de transações no LocalStorage.
 */
export function salvarTransacoes(transacoes: Transacao[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACOES, JSON.stringify(transacoes));
  } catch (error) {
    console.error('Erro ao salvar transações no LocalStorage:', error);
  }
}

/**
 * Restaura os dados iniciais do sistema para fins de testes ou demonstração.
 */
export function resetarParaDadosIniciais(): { pessoas: Pessoa[]; transacoes: Transacao[] } {
  salvarPessoas(DADOS_INICIAIS_PESSOAS);
  salvarTransacoes(DADOS_INICIAIS_TRANSACOES);
  return {
    pessoas: DADOS_INICIAIS_PESSOAS,
    transacoes: DADOS_INICIAIS_TRANSACOES,
  };
}
