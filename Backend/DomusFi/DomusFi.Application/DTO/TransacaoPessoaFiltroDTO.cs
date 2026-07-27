using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Application.DTO
{
    public class TransacaoPessoaFiltroDTO
    {
        public string? Termo { get; set; }
        public string? Tipo { get; set; } // "receita", "despesa" ou "todos"/null
        public int Pagina { get; set; } = 1;
        public int TamanhoPagina { get; set; } = 5;
    }
}
