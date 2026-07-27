using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class RelatorioRankingResponseDTO
    {
        public string TipoRelatorio { get; set; } = string.Empty; // "receita" ou "despesa"
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public decimal TotalGeralPeriodo { get; set; }
        public IEnumerable<RankingPessoaDTO> Ranking { get; set; } = new List<RankingPessoaDTO>();
    }
}
