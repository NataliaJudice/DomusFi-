using DomusFi.Application.Interfaces.Repositories;
using DomusFi.Application.Interfaces.Services;
using DomusFi.Application.Services;
using DomusFi.Infra.Data.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomusFi.Infra.Ioc
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureIoC(this IServiceCollection services, IConfiguration configuration)
        {
            //Repositorios
            services.AddScoped<IPessoasRepository, PessoasRepository>();
            services.AddScoped<ITransacoesRepository, TransacoesRepository>();


            //Serviços
            services.AddScoped<IPessoasService, PessoasService>();
            services.AddScoped<ITransacoesService, TransacoesService>();


            return services;
        }
    }
}
