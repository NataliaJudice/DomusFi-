using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class TransacaoResumoDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public DateTime? DataTransacao { get; set; }
    }
}
