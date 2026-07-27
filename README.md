
# DomusFi

Sistema completo de gerenciamento financeiro e controle de propostas/pessoas, desenvolvido com React no frontend e C# / .NET (Clean Architecture) no backend.

## Tecnologias Utilizadas
### Frontend
* **React** com **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React** (Ícones)

### Backend
* **C# / .NET** (ASP.NET Core)
* **Clean Architecture** (`API`, `Application`, `Domain`, `Infra.Data`, `Infra.Ioc`)
* **SQL Server** / **Entity Framework Core**

## Como Executar o Projeto

Certifique-se de ter o **Node.js** e o **.NET SDK** devidamente instalados em sua máquina antes de prosseguir.

### 1. Clonar o Repositório
Abra o seu terminal e execute os comandos abaixo:
```bash
git clone https://github.com/NataliaJudice/DomusFi-.git
cd DomusFi-
```
### 2. Configurar a Connection String e o Banco de Dados
Para que o backend consiga se comunicar com o banco de dados, é necessário configurar a Connection String no arquivo de configurações da API (appsettings.Development.json ou appsettings.json na pasta do backend).

Certifique-se de adicionar a seguinte estrutura de conexão no seu arquivo de configuração:

```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=DomusFi_DB;Integrated Security=True;Connect Timeout=30;Encrypt=True;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False;Command Timeout=30"
  }
}
```
### Como aplicar o banco de dados pelo Visual Studio:
Abra a solução abrindo o arquivo DomusFi.sln localizado na pasta Backend/DomusFi/.

No menu superior, vá em Exibir > Outras janelas > Console do Gerenciador de Pacotes.

Na parte superior do console que abrir na tela, certifique-se de que o "Projeto padrão está selecionado como DomusFi.Infra.Data.
<img width="865" height="77" alt="Sem título" src="https://github.com/user-attachments/assets/56cdb21a-81a4-432c-a37c-5aa874389acf" />

Execute o comando para aplicar o banco de dados no seu SQL Server local:
```bash
Update-database
```
### 3. Executar o Backend
Navegue até a pasta da API:
```bash
cd Backend/DomusFi/DomusFi.API
```
Execute a aplicação:
```bash
dotnet run
```
### 4. Executar o Frontend
Abra um novo terminal na raiz do projeto e entre na pasta do frontend:
```bash
cd Frontend
```
Instale as dependências:
```bash
npm install
```
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
