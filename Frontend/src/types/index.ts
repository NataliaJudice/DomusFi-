/**
 * Definição dos Tipos e Interfaces do Sistema de Controle de Gastos Residenciais
 * Conforme especificação do Desafio Técnico.
 */

/**
 * Tipo de transação financeira:
 * - 'receita': Entradas / Rendimentos
 * - 'despesa': Saídas / Gastos
 */
export type TipoTransacao = 'receita' | 'despesa';

/**
 * Representa uma Pessoa no sistema.
 */
export interface Pessoa {
  /** Identificador único gerado automaticamente */
  id: string;
  /** Nome completo da pessoa */
  nome: string;
  /** Idade em anos (utilizado para validar regra de menor de idade) */
  idade: number;
}

/**
 * Representa uma Transação Financeira no sistema.
 */
export interface Transacao {
  /** Identificador único gerado automaticamente */
  id: string;
  /** Descrição sucinta da receita ou despesa */
  descricao: string;
  /** Valor monetário da transação (positivo) */
  valor: number;
  /** Tipo da transação: 'receita' ou 'despesa' */
  tipo: TipoTransacao;
  /** ID da pessoa associada a esta transação (chave estrangeira) */
  pessoaId: string;
  /** Data em que a transação efetivamente ocorreu (ISO String) */
  dataTransacao?: string;
  /** Data/Hora em que a transação foi registrada (ISO String) */
  dataCriacao: string;
}

/**
 * Resumo financeiro consolidado por pessoa.
 */
export interface ResumoPessoa {
  pessoa: Pessoa;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  qtdTransacoes: number;
}

/**
 * Resumo financeiro geral de todas as pessoas do sistema.
 */
export interface ResumoGeral {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
  totalPessoas: number;
  totalTransacoes: number;
  qtdMenoresDeIdade: number;
}
