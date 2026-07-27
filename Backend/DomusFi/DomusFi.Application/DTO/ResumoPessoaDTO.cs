using DomusFi.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class ResumoPessoaDTO
    {
        public PessoaDTO Pessoa { get; set; } = null!;
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
        public int QtdTransacoes { get; set; }
        public int TotalTransacoesFiltradas { get; set; }
        public int PaginaAtual { get; set; }
        public int TotalPaginas { get; set; }
        public IEnumerable<TransacaoResumoDTO> UltimasTransacoes { get; set; } = new List<TransacaoResumoDTO>();
    }
}
