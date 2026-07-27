using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Domain.Models
{
    public class Pessoas
    {
        public Guid IdPessoas { get; set; }
        public string Nome { get; set; }
        public int Idade { get; set; }
        public ICollection<Transacoes> Transacoes { get; set; }
    }
}
