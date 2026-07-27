using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Domain.Models
{
    public class Transacoes
    {
        public Guid IdTransacoes { get; set; }
        public string Descricao { get; set; }
        public decimal Valor {  get; set; }
        public string TipoDespesa { get; set; }
        public DateTime? DataTransacao { get; set; }
        public Guid IdPessoa { get; set; }
        public Pessoas Pessoas { get; set; }

    }
}
