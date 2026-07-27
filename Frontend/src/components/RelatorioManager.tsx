/**
 * Componente Gerador de Relatórios Financeiros Residenciais
 *
 * Consome os dados do backend utilizando o DTO TransacoesResponseDTO
 */

import React, { useState, useEffect, useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  User,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatarMoeda, formatarData } from '../utils/formatters';
import {
  apiService,
  RelatorioRankingResponseDTO,
  RelatorioIndividualResponseDTO,
  TransacoesResponseDTO,
} from '../services/apiService';

export type TipoRelatorio = 'ranking-receita' | 'ranking-despesa' | 'individual-pessoa';

// Hook para alternar perfeitamente entre tabela (desktop) e cards (mobile)
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

export const RelatoriosManager: React.FC = () => {
  const { pessoas } = useFinance();
  const isMobile = useIsMobile(768);

  // Estado do Tipo de Relatório Selecionado
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('ranking-receita');

  // Estados dos Filtros de Data
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [filtroRapido, setFiltroRapido] = useState<'tudo' | 'este-mes' | 'mes-passado' | '30-dias' | 'ano-atual'>('tudo');

  // Estado do Filtro de Pessoa
  const [pessoaSelecionadaId, setPessoaSelecionadaId] = useState<string>('todas');

  // Estados para armazenamento dos dados retornados do Backend
  const [dadosRanking, setDadosRanking] = useState<RelatorioRankingResponseDTO | null>(null);
  const [dadosIndividual, setDadosIndividual] = useState<RelatorioIndividualResponseDTO | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  // Busca os dados do backend
  const carregarRelatorio = useCallback(async () => {
    setCarregando(true);
    setErroApi(null);

    try {
      if (tipoRelatorio === 'ranking-receita' || tipoRelatorio === 'ranking-despesa') {
        const tipoQuery = tipoRelatorio === 'ranking-receita' ? 'receita' : 'despesa';
        const res = await apiService.obterRelatorioRanking(tipoQuery, dataInicio, dataFim);
        setDadosRanking(res);
      } else {
        const res = await apiService.obterRelatorioIndividual(pessoaSelecionadaId, dataInicio, dataFim);
        setDadosIndividual(res);
      }
    } catch (err: any) {
      setErroApi(err.message || 'Erro ao consultar relatório no servidor.');
    } finally {
      setCarregando(false);
    }
  }, [tipoRelatorio, dataInicio, dataFim, pessoaSelecionadaId]);

  useEffect(() => {
    carregarRelatorio();
  }, [carregarRelatorio]);

  const aplicarFiltroRapido = (tipo: 'tudo' | 'este-mes' | 'mes-passado' | '30-dias' | 'ano-atual') => {
    setFiltroRapido(tipo);
    const hoje = new Date();

    if (tipo === 'tudo') {
      setDataInicio('');
      setDataFim('');
      return;
    }

    if (tipo === 'este-mes') {
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      setDataInicio(primeiroDia.toISOString().split('T')[0]);
      setDataFim(ultimoDia.toISOString().split('T')[0]);
      return;
    }

    if (tipo === 'mes-passado') {
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      setDataInicio(primeiroDia.toISOString().split('T')[0]);
      setDataFim(ultimoDia.toISOString().split('T')[0]);
      return;
    }

    if (tipo === '30-dias') {
      const inicio = new Date();
      inicio.setDate(hoje.getDate() - 30);
      setDataInicio(inicio.toISOString().split('T')[0]);
      setDataFim(hoje.toISOString().split('T')[0]);
      return;
    }

    if (tipo === 'ano-atual') {
      const primeiroDia = new Date(hoje.getFullYear(), 0, 1);
      setDataInicio(primeiroDia.toISOString().split('T')[0]);
      setDataFim(hoje.toISOString().split('T')[0]);
      return;
    }
  };

  /**
   * EXPORTAR PARA EXCEL (.xlsx formatado)
   */
  const handleExportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Estilos Padrão
    const corIndigo = '4F46E5';
    const fonteBranca: Partial<ExcelJS.Font> = {
      name: 'Segoe UI',
      color: { argb: 'FFFFFF' },
      bold: true,
      size: 10,
    };

    if (tipoRelatorio === 'ranking-receita' || tipoRelatorio === 'ranking-despesa') {
      const ehReceita = tipoRelatorio === 'ranking-receita';

      // Título do Relatório
      worksheet.mergeCells('A1:F1');
      const tituloCell = worksheet.getCell('A1');
      tituloCell.value = `DOMUSFI - RANKING DE ${ehReceita ? 'RECEITAS' : 'DESPESAS'}`;
      tituloCell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFF' } };
      tituloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
      tituloCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 28;

      // Cabeçalho das Colunas
      const headers = ['Posição', 'Nome da Pessoa', 'Idade', 'Total (R$)', 'Participação (%)', 'Qtd. Trans.'];
      const headerRow = worksheet.addRow(headers);
      headerRow.height = 22;

      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: corIndigo } };
        cell.font = fonteBranca;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Adicionar Dados
      const totalGeral = dadosRanking?.totalGeralPeriodo || 1;
      (dadosRanking?.ranking || []).forEach((item) => {
        const pct = item.porcentagemParticipacao || ((item.totalValor || 0) / totalGeral) * 100;

        const row = worksheet.addRow([
          `${item.posicao}º`,
          item.nome,
          item.idade,
          item.totalValor || 0,
          pct / 100,
          item.qtdTransacoes || 0,
        ]);

        row.height = 18;

        row.getCell(4).numFmt = '"R$" #,##0.00';
        row.getCell(5).numFmt = '0.0%';

        row.getCell(1).alignment = { horizontal: 'center' };
        row.getCell(3).alignment = { horizontal: 'center' };
        row.getCell(6).alignment = { horizontal: 'center' };
      });

    } else {
      // Relatório Individual
      worksheet.mergeCells('A1:E1');
      const tituloCell = worksheet.getCell('A1');
      tituloCell.value = 'DOMUSFI - EXTRATO INDIVIDUAL';
      tituloCell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFF' } };
      tituloCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
      tituloCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 28;

      const headers = ['Pessoa', 'Data', 'Descrição', 'Tipo', 'Valor (R$)'];
      const headerRow = worksheet.addRow(headers);
      headerRow.height = 22;

      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: corIndigo } };
        cell.font = fonteBranca;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      (dadosIndividual?.pessoas || []).forEach((p) => {
        (p.transacoes || []).forEach((t: TransacoesResponseDTO) => {
          const tipoTexto = (t.tipoDespesa || t.tipoDespesaNome || t.tipo || '').toUpperCase();
          const ehReceita = tipoTexto.includes('RECEITA');

          const row = worksheet.addRow([
            p.nome,
            formatarData(t.dataTransacao || t.dataCriacao || ''),
            t.descricao,
            tipoTexto,
            t.valor || 0,
          ]);

          row.height = 18;

          const celulaTipo = row.getCell(4);
          celulaTipo.font = { bold: true, color: { argb: ehReceita ? '059669' : 'E11D48' }, size: 9 };
          celulaTipo.alignment = { horizontal: 'center' };

          row.getCell(2).alignment = { horizontal: 'center' };

          row.getCell(5).numFmt = '"R$" #,##0.00';
          row.getCell(5).font = { bold: true };
        });
      });
    }

    // Ajuste Automático COMPACTO de Largura das Colunas
    worksheet.columns.forEach((column) => {
      let maxLen = 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        if (cell.row === '1') return;

        const val = cell.value ? cell.value.toString() : '';
        if (val.length > maxLen) {
          maxLen = val.length;
        }
      });
      column.width = Math.min(maxLen + 3, 32);
    });

    // Download do Arquivo .xlsx
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `relatorio_domusfi_${Date.now()}.xlsx`);
  };

  const listaPessoasRelatorio = dadosIndividual?.pessoas || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. SELETOR PRINCIPAL E AÇÕES */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Gerador de Relatórios Financeiros
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consultas diretas do banco de dados C# com suporte a relatórios consolidados e exportação.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportarExcel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar p/ Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
               Selecione o Tipo de Relatório:
            </label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as TipoRelatorio)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-indigo-500/40 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ranking-receita">
                 1. Ranking: Quem Coloca Mais Dinheiro na Casa (Maior Receita)
              </option>
              <option value="ranking-despesa">
                 2. Ranking: Quem Gasta Mais Dinheiro na Casa (Maior Despesa)
              </option>
              <option value="individual-pessoa">
                 3. Relatório Individual por Pessoa (Lançamentos e Extrato)
              </option>
            </select>
          </div>

          {tipoRelatorio === 'individual-pessoa' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                 Filtrar por Pessoa:
              </label>
              <select
                value={pessoaSelecionadaId}
                onChange={(e) => setPessoaSelecionadaId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="todas"> Todas as Pessoas ({pessoas.length})</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                     {p.nome} ({p.idade} anos)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. CONTROLE DE DATAS */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Controle do Período do Relatório</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Atalhos:</span>
          <button
            onClick={() => aplicarFiltroRapido('tudo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filtroRapido === 'tudo'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Todas as Datas
          </button>
          <button
            onClick={() => aplicarFiltroRapido('este-mes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filtroRapido === 'este-mes'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => aplicarFiltroRapido('mes-passado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filtroRapido === 'mes-passado'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Mês Passado
          </button>
          <button
            onClick={() => aplicarFiltroRapido('30-dias')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filtroRapido === '30-dias'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Últimos 30 Dias
          </button>
          <button
            onClick={() => aplicarFiltroRapido('ano-atual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filtroRapido === 'ano-atual'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Ano Atual
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data de Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                setFiltroRapido('tudo');
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data de Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => {
                setDataFim(e.target.value);
                setFiltroRapido('tudo');
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDataInicio('');
                setDataFim('');
                setFiltroRapido('tudo');
              }}
              className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" /> Limpar Datas
            </button>
          </div>
        </div>
      </div>

      {erroApi && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span className="font-medium">{erroApi}</span>
        </div>
      )}

      {carregando ? (
        <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span>Buscando dados do servidor C#...</span>
        </div>
      ) : (
        <>
          {/* RANKING */}
          {(tipoRelatorio === 'ranking-receita' || tipoRelatorio === 'ranking-despesa') && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      tipoRelatorio === 'ranking-receita'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tipoRelatorio === 'ranking-receita' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {tipoRelatorio === 'ranking-receita'
                        ? 'Ranking: Quem Coloca Mais Dinheiro na Casa'
                        : 'Ranking: Quem Gasta Mais Dinheiro na Casa'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Filtrado do banco ({dataInicio || 'Início'} até {dataFim || 'Hoje'}).
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Total do Período
                  </span>
                  <span
                    className={`text-base font-extrabold ${
                      tipoRelatorio === 'ranking-receita'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatarMoeda(dadosRanking?.totalGeralPeriodo || 0)}
                  </span>
                </div>
              </div>

              {!dadosRanking || !dadosRanking.ranking || dadosRanking.ranking.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                  Nenhum registro encontrado para o período selecionado.
                </div>
              ) : (
                <div className="space-y-4">
                  {dadosRanking.ranking.map((item) => {
                    const totalGeral = dadosRanking.totalGeralPeriodo || 0;
                    const pctCalculada = totalGeral > 0 ? ((item.totalValor || 0) / totalGeral) * 100 : 0;
                    const porcentagem = item.porcentagemParticipacao || (item as any).PorcentagemParticipacao || pctCalculada;
                    const larguraBarra = Math.max(Math.min(porcentagem, 100), 1);

                    return (
                      <div
                        key={item.idPessoa || item.nome}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-black shadow-xs ${
                                tipoRelatorio === 'ranking-receita'
                                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300/80'
                                  : 'bg-rose-500 text-white ring-2 ring-rose-300/80'
                              }`}
                            >
                              {item.posicao}º
                            </span>

                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {item.nome}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.idade} anos • {item.qtdTransacoes || 0} transação(ões)
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-sm font-extrabold block ${
                                tipoRelatorio === 'ranking-receita'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {formatarMoeda(item.totalValor || 0)}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {porcentagem.toFixed(1)}% do total da casa
                            </span>
                          </div>
                        </div>

                        {/* Barra Proporcional */}
                        <div
                          className="w-full rounded-full overflow-hidden"
                          style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${larguraBarra}%`,
                              backgroundColor: tipoRelatorio === 'ranking-receita' ? '#10b981' : '#f43f5e',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* RELATÓRIO INDIVIDUAL */}
          {tipoRelatorio === 'individual-pessoa' && (
            <div className="space-y-6">
              {listaPessoasRelatorio.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Nenhuma pessoa encontrada
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Não existem dados para gerar o relatório individual no período ou filtro selecionado.
                  </p>
                </div>
              ) : (
                listaPessoasRelatorio.map((item) => {
                  const listaTransacoes = item.transacoes || [];

                  return (
                    <div
                      key={item.idPessoa || item.nome}
                      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-lg shrink-0">
                            {(item.nome || 'P').charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {item.nome}
                              </h3>
                              {item.idade < 18 ? (
                                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold">
                                  {item.idade} anos
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold">
                                  {item.idade} anos
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Extrato completo dos lançamentos no período de {dataInicio || 'Início'} até {dataFim || 'Hoje'}.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Receitas</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              +{formatarMoeda(item.totalReceitas || 0)}
                            </span>
                          </div>
                          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Despesas</span>
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                              -{formatarMoeda(item.totalDespesas || 0)}
                            </span>
                          </div>
                          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Saldo</span>
                            <span className={`text-xs font-extrabold ${(item.saldo || 0) >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'}`}>
                              {formatarMoeda(item.saldo || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {listaTransacoes.length === 0 ? (
                        <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                          Nenhum lançamento encontrado para {item.nome} no período selecionado.
                        </div>
                      ) : isMobile ? (
                        /* CARDS NO MOBILE */
                        <div className="space-y-3">
                          {listaTransacoes.map((t: TransacoesResponseDTO) => {
                            const tipoStr = (t.tipoDespesa || t.tipoDespesaNome || t.tipo || '').toLowerCase();
                            const ehReceita = tipoStr.includes('receita');
                            const idItem = t.idTransacoes || t.id || `${t.descricao}-${t.valor}`;
                            const dataFormatacao = t.dataTransacao || t.dataCriacao || '';

                            return (
                              <div
                                key={idItem}
                                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-3 shadow-xs"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white break-words">
                                      {t.descricao}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                      {formatarData(dataFormatacao)}
                                    </p>
                                  </div>

                                  {ehReceita ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 text-[10px] font-bold shrink-0">
                                      <ArrowUpRight className="w-3 h-3" />
                                      Receita
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-1 text-[10px] font-bold shrink-0">
                                      <ArrowDownRight className="w-3 h-3" />
                                      Despesa
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-2.5">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    Valor
                                  </span>
                                  <span
                                    className={`font-extrabold text-base ${
                                      ehReceita
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-rose-600 dark:text-rose-400'
                                    }`}
                                  >
                                    {ehReceita ? '+' : '-'} {formatarMoeda(t.valor || 0)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* TABELA NO DESKTOP */
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider bg-slate-50 dark:bg-slate-800/30">
                                <th className="py-2.5 px-3 font-semibold">Data</th>
                                <th className="py-2.5 px-3 font-semibold">Descrição</th>
                                <th className="py-2.5 px-3 font-semibold">Tipo</th>
                                <th className="py-2.5 px-3 font-semibold text-right">Valor</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {listaTransacoes.map((t: TransacoesResponseDTO) => {
                                const tipoStr = (t.tipoDespesa || t.tipoDespesaNome || t.tipo || '').toLowerCase();
                                const ehReceita = tipoStr.includes('receita');
                                const idItem = t.idTransacoes || t.id || `${t.descricao}-${t.valor}`;
                                const dataFormatacao = t.dataTransacao || t.dataCriacao || '';

                                return (
                                  <tr key={idItem} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                                      {formatarData(dataFormatacao)}
                                    </td>
                                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                                      {t.descricao}
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                      {ehReceita ? (
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-bold inline-flex items-center gap-1">
                                          <ArrowUpRight className="w-3 h-3" /> Receita
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded text-[10px] font-bold inline-flex items-center gap-1">
                                          <ArrowDownRight className="w-3 h-3" /> Despesa
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      className={`py-3 px-3 text-right font-extrabold whitespace-nowrap ${
                                        ehReceita
                                          ? 'text-emerald-600 dark:text-emerald-400'
                                          : 'text-rose-600 dark:text-rose-400'
                                      }`}
                                    >
                                      {ehReceita ? '+' : '-'} {formatarMoeda(t.valor || 0)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};