using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class RelatorioPessoaIndividualDTO
    {
        public Guid IdPessoa { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
        public IEnumerable<TransacoesResponseDTO> Transacoes { get; set; } = new List<TransacoesResponseDTO>();
    }
}
