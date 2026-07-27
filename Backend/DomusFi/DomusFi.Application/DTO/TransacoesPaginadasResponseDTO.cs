using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class TransacoesPaginadasResponseDTO
    {
        public int TotalRegistros { get; set; }
        public int PaginaAtual { get; set; }
        public int TotalPaginas { get; set; }
        public IEnumerable<TransacoesResponseDTO> Items { get; set; } = new List<TransacoesResponseDTO>();
    }
}
