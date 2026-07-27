
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
### 2. Configurar o Banco de Dados (SQL Server)
Como configurar e aplicar o banco de dados pelo Visual Studio:
Abra a solução abrindo o arquivo DomusFi.sln localizado na pasta Backend/DomusFi/.

No menu superior, vá em View > Other Windows > Package Manager Console.

Na parte superior do console que abrir na tela, certifique-se de que o Default project está selecionado como DomusFi.Infra.Data (ou a camada responsável pelas migrations).

Execute o comando para aplicar o banco de dados no seu SQL Server local:
```bash
Update-Database
```
(Ou, se preferir via terminal na pasta da API: dotnet ef database update)

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
