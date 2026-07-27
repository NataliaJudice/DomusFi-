using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class RelatorioIndividualResponseDTO
    {
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public IEnumerable<RelatorioPessoaIndividualDTO> Pessoas { get; set; } = new List<RelatorioPessoaIndividualDTO>();
    }
}
