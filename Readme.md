# FixItNow

Sistema web de gerenciamento de chamados de manutenção, desenvolvido como projeto de TCC. A plataforma conecta **empresas** e **profissionais autônomos**, permitindo cadastrar serviços, registrar solicitações, acompanhar atendimentos, organizar pagamentos e registrar avaliações.

## Objetivo

Centralizar o fluxo de solicitação de serviços de manutenção em uma aplicação simples, acessível e organizada. O projeto possui uma interface web em React e uma API em Laravel, com persistência em banco de dados relacional.

## Funcionalidades previstas

- cadastro e autenticação de empresas e profissionais autônomos;
- cadastro e consulta de serviços;
- associação entre serviços e profissionais;
- abertura e acompanhamento de solicitações;
- registro de pagamentos;
- avaliação de solicitações concluídas;
- painel, histórico, perfil e configurações de acessibilidade;
- suporte de interface a português, inglês e espanhol;
- modo claro, modo escuro, tamanho de texto e alto contraste.

## Arquitetura

```text
FixItNow/
├── docs/                  # documentação acadêmica e técnica
├── src/
│   ├── frontend/          # React + Vite
│   └── backend/           # Laravel 12 + API REST
├── .gitignore
└── README.md
```

### Frontend

O frontend utiliza React 19, Vite, React Router, Tailwind CSS e Axios. As páginas ficam em `src/frontend/src/Pages`, os componentes reutilizáveis em `Components` e as preferências globais em `Context`.

### Backend

O backend utiliza PHP 8.2+, Laravel 12, Eloquent ORM e Laravel Sanctum. As rotas da API ficam em `src/backend/routes/api.php`, os controladores em `app/Http/Controllers`, os modelos em `app/Models` e as migrações em `database/migrations`.

## Requisitos

- Node.js 20.19+ ou 22.12+ (validado com 22.13.0);
- npm;
- PHP 8.2 ou superior;
- Composer;
- SQLite para execução local ou MySQL configurado no `.env`;
- Git, opcionalmente.

## Execução local

### Backend

```bash
cd src/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

O arquivo `.env` local deve permanecer fora do versionamento. Para desenvolvimento simples, é possível usar SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### Frontend

Em outro terminal:

```bash
cd src/frontend
npm ci
npm run dev
```

O endereço exibido pelo Vite será usado para acessar a interface. Antes de uma entrega, execute também:

```bash
npm run lint
npm run test
npm run build
```

### Testes do backend

```bash
cd src/backend
php artisan test
```

## Endpoints principais

A API possui grupos para:

- `POST /api/auth/empresa/cadastro`;
- `POST /api/auth/autonomo/cadastro`;
- `POST /api/auth/login`;
- `/api/servicos`;
- `/api/autonomos`;
- `/api/empresas`;
- `/api/solicitacoes`;
- `/api/pagamentos`;
- `/api/servicos-autonomos`;
- `/api/avaliacoes`.

As operações de cadastro e alteração devem receber apenas os campos esperados pelo endpoint. A validação deve ser mantida nos controladores ou extraída para Form Requests conforme o crescimento do sistema.

## Banco de dados

As principais entidades são `users`, `empresas`, `autonomos`, `servicos`, `solicitacoes`, `pagamentos`, `servicos_autonomo`, `avaliacoes` e `personal_access_tokens`. Os modelos foram alinhados aos nomes físicos definidos nas migrações, evitando o plural automático incorreto de palavras em português.

## Organização acadêmica

A documentação do TCC está separada em:

- `docs/01-introducao.md`: problema, justificativa, objetivos e escopo;
- `docs/02-fundamentacao.md`: conceitos, tecnologias e referências a desenvolver;
- `docs/03-metodologia.md`: abordagem, etapas, requisitos e validação;
- `docs/04-requisitos-e-casos-de-uso.md`: requisitos funcionais, não funcionais e fluxos;
- `docs/05-guia-de-entrega.md`: checklist para apresentação e entrega.

## Segurança e boas práticas

- não versionar `.env`, senhas, chaves ou logs;
- não usar `$request->all()` em endpoints de produção; validar e selecionar campos permitidos;
- manter nomes de classes e arquivos compatíveis com PSR-4;
- executar lint, build, migrações e testes antes da entrega;
- registrar alterações relevantes no changelog ou no histórico Git.

## Status desta organização

Esta versão organiza a raiz do projeto, substitui READMEs genéricos, preenche a documentação principal do TCC, corrige inconsistências entre modelos e migrações e define um procedimento reprodutível de execução e validação.

## Revisão de persistência — 21/10/2026

Avaliações agora são salvas na API vinculadas à solicitação concluída da empresa autenticada; descrição do perfil, campos do chamado, painel, histórico e andamento de pedidos foram integrados ao banco. Todos os grupos de rotas passaram por revisão, com validação, autenticação de mutations e titularidade dos recursos.

O [relatório final](RELATORIO_FINAL.md) contém o inventário de rotas, alterações por arquivo, migrações, testes, compatibilidade e instruções completas. Para uma instalação existente, preserve `.env`, `APP_KEY`, banco e fotos; faça backup antes de `php artisan migrate` e **não use `migrate:fresh`**. A SQLite incluída foi preservada: execute as migrações antes de usar o site.

Em desenvolvimento, o Vite encaminha `/api` e `/storage` ao Laravel em `127.0.0.1:8000`. Em produção configure `VITE_API_URL` e `APP_URL` para a origem real da API. As preferências de acessibilidade continuam locais ao navegador; pagamentos são registros vinculados ao chamado, não uma integração de cobrança.
