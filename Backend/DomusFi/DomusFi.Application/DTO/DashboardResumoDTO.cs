using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class DashboardResumoDTO
    {
        public decimal TotalReceitasGeral { get; set; }
        public decimal TotalDespesasGeral { get; set; }
        public decimal SaldoLiquidoGeral { get; set; }
        public int TotalPessoas { get; set; }
        public int TotalTransacoes { get; set; }
        public int QtdMenoresDeIdade { get; set; }
        public IEnumerable<ResumoPessoaDTO> Pessoas { get; set; } = new List<ResumoPessoaDTO>();
    }
}
