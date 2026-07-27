using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class RankingPessoaDTO
    {
        public int Posicao { get; set; }
        public Guid IdPessoa { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public decimal TotalValor { get; set; }
        public double PorcentagemParticipacao { get; set; }
        public int QtdTransacoes { get; set; }
    }
}
