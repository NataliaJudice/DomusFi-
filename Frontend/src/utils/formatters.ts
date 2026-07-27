/**
 * Funções utilitárias de formatação monetária e temporal
 */

/**
 * Formata um número como moeda corrente brasileira (BRL).
 * Exemplo: 1250.4 -> "R$ 1.250,40"
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata uma string de data ISO em padrão legível pt-BR.
 * Exemplo: "2026-07-25T14:30:00.000Z" -> "25/07/2026 às 14:30"
 */
export function formatarData(dataIso?: string): string {
  if (!dataIso) return '-';

  try {
    // Extrai apenas a parte da data 'YYYY-MM-DD' descartando o horário
    const dataApenas = dataIso.split('T')[0];
    const [ano, mes, dia] = dataApenas.split('-');

    if (!ano || !mes || !dia) return dataIso;

    // Constrói a data sem sofrer deslocamento de fuso horário
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(data);
  } catch {
    return dataIso;
  }
}
