using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class TransacoesRequestDTO
    {
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public string TipoDespesa { get; set; }
        public DateTime? DataTransacao { get; set; }
        public Guid IdPessoa { get; set; }
    }
}
