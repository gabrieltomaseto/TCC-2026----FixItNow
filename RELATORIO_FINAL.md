# FixItNow — relatório final da correção de persistência e revisão da API

**Data:** 21/10/2026  
**Projeto-base:** `FixItNow-final-Sophia-foto-perfil.zip`  
**Entrega:** código-fonte corrigido, testes de regressão e este relatório. Não houve publicação nem alteração de um servidor de produção.

## 1. Resultado

O sistema de avaliação deixou de apenas mostrar uma mensagem local. A empresa seleciona uma solicitação concluída, informa estrelas e comentários e envia os dados à API. O servidor valida a conta, a titularidade e o estado do atendimento; grava `id_solicitacao` corretamente; impede duplicação; e permite editar nota/comentários sem mover a avaliação para outro chamado. A confirmação aparece somente depois de uma resposta válida do servidor.

Também foram corrigidos os demais problemas de persistência confirmados: descrição sem salvamento, campos do chamado descartados, painel e histórico fictícios, ausência de atualização dos pedidos, logout sem revogação na API, pagamentos sem vínculo, falta de validação e de titularidade e atualização incorreta de uma relação com chave composta.

Foram revisadas as **40 rotas originais da API**; nenhuma foi removida. Acrescentaram-se **2 rotas de perfil**, totalizando **42 rotas**. Todos os grupos têm cobertura de regressão. Não permaneceu outra falha de gravação confirmada nos fluxos auditados e testados. Isso não equivale a uma auditoria de segurança exaustiva de produção.

## 2. Preservação das funções e do design

A arquitetura React/Vite + Laravel/Sanctum foi mantida. Não houve substituição de framework, redesenho, troca de identidade visual ou integração com serviços externos.

A comparação com o ZIP confirmou que o portal Sophia, as imagens, os logos, o CSS global, `App.jsx`, a navegação superior, as preferências e os arquivos públicos permanecem idênticos. Cadastro, login, foto de perfil, tema escuro, modo claro, acessibilidade e navegação existentes foram preservados.

Nas telas corrigidas foram mantidos os cartões, tabelas, cores e classes visuais principais. Acrescentaram-se somente os controles necessários aos fluxos incompletos: seleção do chamado e comentários na avaliação, estados de carregamento/salvamento, mensagens de erro/sucesso e seleção de status com botão de salvar nos pedidos. O título incorreto “Avaliar empresa” passou a “Avaliar atendimento”.

A SQLite incluída em `src/backend/database/database.sqlite` também permaneceu **byte a byte idêntica ao arquivo enviado**. Migrações e testes de atualização foram executados em cópias separadas; dados sintéticos de teste não foram incluídos na entrega. Por isso, é obrigatório executar `php artisan migrate` no ambiente de uso antes de abrir o site.

## 3. Correções realizadas

### 3.1 Avaliações vinculadas à solicitação

- A tela carrega as solicitações da empresa e disponibiliza apenas as concluídas/finalizadas.
- O POST envia `{ id_solicitacao, nota, comentarios }` com o token da sessão.
- A API exige nota inteira de 1 a 5 e comentários opcionais de até 5000 caracteres.
- Apenas a empresa dona do chamado pode criar, editar ou excluir sua avaliação. O profissional atribuído pode consultar as avaliações de seus atendimentos.
- Um índice `UNIQUE` garante uma avaliação por solicitação. Tentativas duplicadas, inclusive violações concorrentes da restrição, retornam 409.
- A avaliação existente é recuperada após recarregar a página; o botão passa a atualizar, e não a criar outra avaliação.
- O vínculo não é alterado pelo PUT. A solicitação avaliada não pode ser reaberta nem ter serviço/profissional trocados.
- A interface confere o ID e o vínculo retornados antes de informar sucesso.

### 3.2 Abertura de chamado

Todos os campos já exibidos no formulário passaram a integrar o payload e o banco:

| Campo da interface | Campo persistido |
|---|---|
| Nome | `nome_contato` |
| Endereço/empresa ou setor | `empresa_contato` |
| Local da ocorrência | `local_atendimento` |
| Telefone | `telefone_contato` |
| Tipo de serviço | `tipo_servico` |
| Prioridade | `prioridade` |
| Preço estimado | `preco_estimado` |
| Data preferencial | `data_solicitacao` — mantido o contrato já existente |
| Descrição | `descricao_problema` |
| Serviço e profissional escolhidos | `id_servico`, `id_autonomo` |

A empresa associada é sempre obtida do token (`id_empresa`), nunca de um ID informado pelo cliente. A descrição agora é obrigatória na API, coerente com o banco. Os IDs são validados com `exists`. O preço aceita zero, não aceita negativos e é convertido corretamente de valores como `R$ 1.234,56`.

O botão Limpar passou a resetar o estado React. O campo preço inicia com string vazia, evitando valor não controlado. A tela não mostra mais sucesso para contas autônomas nem antes da confirmação do servidor. Cliques repetidos são bloqueados durante envio; depois do sucesso, é preciso editar ou limpar para enviar outro chamado.

A API mantém `id_autonomo` opcional/nulo, como previsto na estrutura original. O formulário atual continua exigindo a escolha do profissional. Não foi imposta uma nova obrigatoriedade de associação no catálogo serviço/autônomo, pois o fluxo anterior permite escolher profissionais independentemente desse vínculo.

### 3.3 Perfil e foto

A descrição passou a ter estado controlado, carregamento do servidor e salvamento autenticado em `PUT /api/perfil`. O endpoint altera somente o perfil da própria conta. O cache de sessão é atualizado preservando token e demais informações.

O upload de foto foi preservado e coberto por testes para empresa/autônomo, formatos válidos, autenticação e limites. A migração de foto, que estava pendente na SQLite enviada, foi validada junto às novas migrações em uma cópia do banco. O proxy local `/storage` foi acrescentado ao Vite, para que os avatares salvos no Laravel também sejam acessíveis quando `VITE_API_URL` estiver vazio.

### 3.4 Painel, histórico e pedidos

O painel e o histórico agora consultam solicitações reais da conta autenticada. Os números e a taxa do painel são calculados a partir dessas respostas; as últimas solicitações usam IDs, local e datas reais. O histórico tem filtros funcionais de serviço/categoria, data e status, sem dados fictícios.

O custo mostrado no histórico é o **preço estimado do chamado**, com fallback para o preço do serviço; não representa comprovação de pagamento. Quando não há valor, aparece `—`.

Pedidos mantém a atualização automática de 15 segundos e acrescenta a gravação do status pelo ID numérico real. O retorno do PUT atualiza a linha e os contadores. Rascunhos, mensagens e gravações em andamento são protegidos contra respostas antigas do polling. A interface bloqueia alterações de pedidos já avaliados.

Estados reconhecidos: `Pendente`, `Aberta`, `Em andamento`, `Concluída`, `Finalizada`, `Não aceita` e `Cancelada`. O backend normaliza grafias antigas reconhecidas, como `pendente`/`concluida`, para evitar inconsistência nos filtros.

### 3.5 Demais rotas e integridade

- **Solicitações:** listagem, consulta individual, atualização e exclusão respeitam titularidade; autônomos só alteram status/datas do pedido atribuído; a empresa não é reatribuída pelo payload; exclusão é da empresa dona.
- **Pagamentos:** novos registros exigem `id_solicitacao`; valor/método/status são validados; criação, leitura, edição e exclusão pelo endpoint são limitadas à empresa dona. O vínculo não é movido por um PUT. Pagamentos também podem ser consultados como relação de uma solicitação autorizada.
- **Empresas/autônomos:** validação de campos, formatos, comprimentos e identidades únicas; atualização de nome/e-mail sincroniza o `User` correspondente em transação. A exclusão de um perfil de conta remove o usuário associado e seus tokens, evitando login órfão.
- **Catálogo direto de perfis:** o POST não equivale a cadastro com senha. Ele registra `created_by` a partir do token e exige o tipo de conta correspondente. O criador pode editar/excluir esse registro enquanto ele não tiver uma conta real vinculada. Se houver uma conta real, o dono dessa conta tem prioridade. O cliente não pode forjar o criador.
- **Serviços:** mantido o CRUD e o formato de resposta; limites de preço e campos são validados; mutations exigem autenticação.
- **Serviço/autônomo:** FKs e duplicações são validadas; a alteração utiliza as duas colunas da chave composta, sem presumir uma coluna `id`. Salvar sem mudanças retorna 200 quando o vínculo existe, não um 404 incorreto.
- **Login:** o tipo opcional escolhido na tela é validado antes de gerar token. Tipo incompatível retorna 409 e não substitui a sessão anterior.
- **Logout:** a interface chama a API para revogar o token, e depois limpa a sessão local. Se a rede/API falhar, a sessão local ainda é removida, mas a revogação remota não pode ser garantida.

## 4. Inventário completo das rotas revisadas

O prefixo de todos os caminhos abaixo é `/api`. GET também admite HEAD conforme o Laravel. “CRUD” é discriminado por método e caminho para não ocultar operações.

| Recurso/caminho | Métodos e operações | Acesso/regra |
|---|---|---|
| `/auth/empresa/cadastro` | POST — criar perfil + usuário + token | Público; dados validados; conta empresa |
| `/auth/autonomo/cadastro` | POST — criar perfil + usuário + token | Público; dados validados; conta autônomo |
| `/auth/login` | POST — autenticar/emitir token | Público; credenciais e tipo opcional |
| `/auth/logout` | POST — revogar token atual | Sanctum |
| `/servicos` | GET — listar; POST — criar | GET público; POST autenticado |
| `/servicos/{id}` | GET — consultar; PUT — atualizar; DELETE — remover | GET público; alterações autenticadas |
| `/empresas` | GET — listar; POST — criar catálogo | GET público; POST conta empresa |
| `/empresas/{id}` | GET — consultar; PUT — atualizar; DELETE — remover | GET público; dono real ou criador autorizado do catálogo |
| `/autonomos` | GET — listar; POST — criar catálogo | GET público; POST conta autônomo |
| `/autonomos/{id}` | GET — consultar; PUT — atualizar; DELETE — remover | GET público; dono real ou criador autorizado do catálogo |
| `/solicitacoes` | GET — listar; POST — criar | Autenticado; lista por conta, cria apenas empresa |
| `/solicitacoes/{id}` | GET — consultar; PUT — atualizar; DELETE — remover | Titularidade por empresa/profissional; exclusão só empresa dona |
| `/pagamentos` | GET — listar; POST — criar registro | Empresa dona das solicitações vinculadas |
| `/pagamentos/{id}` | GET — consultar; PUT — atualizar; DELETE — remover | Empresa dona; vínculo mantido |
| `/servicos-autonomos` | GET — listar; POST — associar | GET público; POST autenticado |
| `/servicos-autonomos/{id_servico}/{id_autonomo}` | GET — consultar; PUT — atualizar; DELETE — remover | GET público; alterações autenticadas pela dupla de chaves |
| `/avaliacoes` | GET — listar; POST — avaliar | Leitura autenticada por vínculo; criação só empresa dona |
| `/avaliacoes/{id}` | GET — consultar; PUT — atualizar; DELETE — remover | Leitura por vínculo; alteração/exclusão só empresa dona |
| `/perfil` **novo** | GET — carregar; PUT — salvar descrição | Próprio perfil autenticado |
| `/perfil/foto` | POST — enviar/trocar imagem | Próprio perfil autenticado |

Códigos relevantes: 201 para criação, 200 para leitura/alteração/exclusão, 401 sem autenticação, 403 por papel/titularidade não permitido, 404 para recurso inexistente ou fora do escopo, 409 para duplicação/conflito e 422 para dados inválidos. Envie `Accept: application/json`; nas rotas protegidas envie `Authorization: Bearer <token>`.

## 5. Arquivos alterados/adicionados

### Backend — caminhos relativos a `src/backend/`

| Arquivo | Alteração |
|---|---|
| `routes/api.php` | Preserva endpoints originais; autentica mutations e grupos privados; adiciona GET/PUT perfil |
| `app/Http/Controllers/AuthController.php` | Valida unicidade de perfis/login; verifica tipo antes de token |
| `app/Http/Controllers/AutonomoController.php` | Validação, titularidade real/criador, sincronização User e exclusão transacional |
| `app/Http/Controllers/EmpresaController.php` | Validação, titularidade real/criador, sincronização User e exclusão transacional |
| `app/Http/Controllers/AvaliacaoController.php` | Vínculo, papel/estado, nota/comentários, escopo, unicidade e edição |
| `app/Http/Controllers/PagamentoController.php` | Vínculo com solicitação, validação monetária e escopo |
| `app/Http/Controllers/SolicitacaoController.php` | Campos completos, FKs, titularidade, atualização por papel e estados canônicos |
| `app/Http/Controllers/ServicoController.php` | Regras reutilizadas e valores monetários compatíveis com o schema |
| `app/Http/Controllers/ServicoAutonomoController.php` | Validação e duplicações; atualização por chave composta; no-op correto |
| `app/Http/Controllers/ProfileController.php` **novo** | Leitura e salvamento da descrição do próprio perfil |
| `app/Models/Autonomo.php`, `app/Models/Empresa.php` | Campos `descricao` e `created_by`; foto e relações preservadas |
| `app/Models/Solicitacao.php` | Novos campos, cast monetário e relação `pagamentos` |
| `app/Models/Pagamento.php` | `id_solicitacao`, relação e cast monetário |
| `tests/Feature/AuthTypeTest.php` **novo** | Tipo de login e emissão de token |
| `tests/Feature/ProfilesTest.php` **novo** | Perfil, sincronização, catálogo completo, prioridade do dono, foto e validações |
| `tests/Feature/ProtectedResourcesTest.php` **novo** | Solicitações, avaliações, pagamentos, autenticação, escopo, vínculos e cascades |
| `tests/Feature/PublicResourcesTest.php` **novo** | Catálogo, mutations, FKs, duplicação, no-op e alteração real da chave composta |
| `tests/Feature/Support/ApiFixtures.php` **novo** | Fixtures/tokens isolados e imagens de teste |
| `README.md` | Comandos e contratos atualizados |

### Migrações novas — `src/backend/database/migrations/`

| Arquivo | Efeito |
|---|---|
| `2026_10_21_000001_add_request_details_to_solicitacoes_table.php` | Acrescenta contato, local, tipo, prioridade e preço estimado |
| `2026_10_21_000002_add_descricao_to_profiles_table.php` | Acrescenta descrição às empresas/autônomos |
| `2026_10_21_000003_link_payments_to_solicitacoes.php` | Acrescenta FK nullable para preservar pagamentos antigos |
| `2026_10_21_000004_unique_avaliacao_per_solicitacao.php` | Garante uma avaliação por solicitação |
| `2026_10_21_000005_add_catalog_creator_to_profiles.php` | Conserva criador do catálogo com FK nullable e `nullOnDelete` |

Nenhuma migração antiga foi reescrita. A migração preexistente `2026_10_20_010000_add_foto_path_to_profiles_table.php`, ainda pendente no banco recebido, também será aplicada pelo comando normal de migração.

### Frontend — caminhos relativos a `src/frontend/`

| Arquivo | Alteração |
|---|---|
| `src/Pages/Perfil.jsx` | API para descrição e avaliação; solicitação real, nota/comentários, recarga e edição |
| `src/Pages/NovoChamado.jsx` | Payload completo, reset, preço controlado, confirmação real e bloqueio de envios |
| `src/Pages/Painel.jsx` | Solicitações e métricas reais |
| `src/Pages/Historico.jsx` | Dados reais, filtros, datas e custo estimado |
| `src/Pages/Pedidos.jsx` | Gravação do status por ID, estados por pedido e proteção contra polling antigo |
| `src/Pages/Login.jsx` | Envia tipo escolhido à API |
| `src/Components/AsidePainel.jsx` | Logout remoto antes da limpeza local |
| `src/lib/auth.js` | Atualização do perfil no cache sem substituir a sessão |
| `src/lib/chamado.js` **novo** | Estado inicial, conversão de preço e payload testáveis |
| `tests/chamado.test.js` **novo** | Quatro testes de payload e valores monetários |
| `package.json` | Acrescenta comando `npm run test`; sem novas dependências |
| `vite.config.js` | Proxy `/storage` além de `/api` |
| `README.md` | Requisitos/comandos e configuração da API |

Na raiz, `README.md`, `plan.md` e `TODO.md` foram atualizados; `RELATORIO_FINAL.md` foi acrescentado. Os lockfiles de dependências foram preservados. Dependências, builds, logs, caches, `.env` e links absolutos do ambiente de teste não integram o ZIP de entrega.

## 6. Evidências de validação

| Verificação | Resultado |
|---|---|
| `php artisan test --compact` | **26 testes aprovados, 238 assertions**; inclui suíte original e regressões |
| `php -l` em app, rotas, migrações e testes | Sem erros de sintaxe |
| `npm run lint` | Aprovado |
| `npm run test` | **4 testes aprovados** |
| `npm run build` | Aprovado |
| Instalação/migração em banco vazio de teste | Aprovada |
| Migração sobre cópia da SQLite enviada | Aprovada; 1 usuário e 1 autônomo existentes preservados |
| Inventário Laravel da API | 42 rotas; caminhos/métodos originais preservados |
| Fluxo de browser com API real | Chamado completo → conclusão pelo profissional → avaliação → descrição → reload → edição sem duplicata → painel/histórico reais |
| Conferência direta do banco isolado | Uma avaliação por chamado, nota atualizada e `id_solicitacao` íntegro |
| Erros JavaScript no fluxo testado | Nenhum |
| Comparação dos arquivos visuais e SQLite | Preservação confirmada |

Ambiente usado: Node 22.13.0, PHP 8.3.6 e Composer 2.7.1. Testes automatizados Laravel utilizaram SQLite `:memory:`; validações de atualização e browser utilizaram arquivos temporários separados. MySQL é suportado pela estrutura Laravel, mas esta revisão foi executada e validada com SQLite, não com uma instância MySQL de produção.

## 7. Instruções de execução — primeira instalação

### Requisitos

Node.js **20.19+ ou 22.12+**, npm, PHP **8.2+**, Composer e as extensões PHP exigidas pelo Laravel. Para SQLite, habilite `pdo_sqlite`/`sqlite3`; para MySQL, `pdo_mysql`. Habilite também extensões usuais como `mbstring`, `xml`, `fileinfo`, `curl` e `zip`.

### Terminal 1 — backend

Partindo da pasta `fixitnow` extraída:

```bash
cd src/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Use o exemplo SQLite incluído:

```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Se o arquivo SQLite não existir em uma instalação nova, crie-o antes das migrações (`touch database/database.sqlite` no Linux/macOS). Não substitua um banco existente. Se houver problema com caminho relativo, configure `DB_DATABASE` com o caminho absoluto real do arquivo no seu computador.

No Windows, crie `.env` copiando `.env.example` pelo explorador ou com `Copy-Item .env.example .env` no PowerShell. O comando `storage:link` pode exigir permissão para criar links simbólicos.

### Terminal 2 — frontend

```bash
cd src/frontend
npm ci
npm run dev
```

Abra **http://localhost:5173**. O portal Sophia continua sendo a abertura para visitantes. Use o cartão “Nosso Site”, entre/cadastre-se e siga ao FixItNow. Em desenvolvimento, deixe `VITE_API_URL` vazio: o Vite encaminha `/api` e `/storage` ao Laravel em `127.0.0.1:8000`.

A base enviada não tem serviços cadastrados. Cadastre um serviço pela API autenticada para disponibilizar opções no novo chamado, ou utilize seus dados reais já existentes. Os dados sintéticos da validação não foram adicionados ao banco entregue.

### Verificações reproduzíveis

```bash
# Na pasta src/backend, após instalar/configurar:
php artisan route:list --path=api
php artisan test

# Na pasta src/frontend:
npm run lint
npm run test
npm run build
```

## 8. Atualização de instalação existente — sem perda de dados

1. Faça backup do banco, `.env` e `storage/app/public` (fotos).
2. Atualize o código, mantendo seu `.env`, sua `APP_KEY`, seu banco e seus arquivos de storage.
3. No backend execute:

```bash
composer install
php artisan optimize:clear
php artisan migrate
php artisan storage:link
php artisan test
```

4. No frontend execute `npm ci`, os testes/lint e `npm run build`; publique a nova saída conforme a configuração já usada pelo seu servidor.

**Não execute `migrate:fresh`, `db:wipe` ou uma nova geração de `APP_KEY` numa instalação existente.** Esses comandos não são necessários para aplicar a correção. Não copie o banco de exemplo sobre o banco real.

### Dados antigos que exigem atenção antes da migração

Se sua base real já possui várias avaliações para o mesmo chamado, a nova restrição de unicidade exige resolução prévia. Identifique duplicações com uma consulta somente leitura:

```sql
SELECT id_solicitacao, COUNT(*) AS quantidade
FROM avaliacoes
GROUP BY id_solicitacao
HAVING COUNT(*) > 1;
```

A migração **não apaga avaliações automaticamente**. Faça backup/exportação e escolha conscientemente como consolidar os registros antes de migrar. Na SQLite enviada não havia avaliações duplicadas.

Pagamentos antigos recebem `id_solicitacao = NULL`, porque o esquema anterior não guardava essa informação. Não se adivinha a associação; eles continuam no banco e devem ser reconciliados com evidência antes de atribuir uma solicitação. Novos pagamentos exigem o vínculo correto.

Perfis legados sem usuário vinculado e sem informação de criador não recebem um dono presumido. Continuam consultáveis, mas uma eventual atribuição administrativa exige identificação explícita do responsável. Os novos registros diretos já guardam seu criador; contas normais mantêm a titularidade por `users.empresa_id`/`users.autonomo_id`.

## 9. Exemplos do contrato da API

Substitua os IDs pelos IDs reais retornados pela sua API. A senha/token não devem ser incorporados ao código ou publicados.

### Avaliar um chamado concluído

```http
POST /api/avaliacoes
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token-da-empresa-dona>
```

```json
{"id_solicitacao": 123, "nota": 5, "comentarios": "Atendimento realizado conforme combinado."}
```

Para editar, use `PUT /api/avaliacoes/<id-da-avaliacao>` com `nota`/`comentarios`. O ID da avaliação não é o ID da solicitação. Não use o PUT para transferir avaliações entre chamados.

### Registrar pagamento relacionado ao atendimento

```http
POST /api/pagamentos
Authorization: Bearer <token-da-empresa-dona>
Accept: application/json
Content-Type: application/json
```

```json
{"id_solicitacao": 123, "valor": 150.50, "metodo": "pix", "status": "pago"}
```

Isso registra um fato informado à API; **não movimenta dinheiro, não cobra cartão e não verifica liquidação bancária**.

### Criar uma opção de serviço

```http
POST /api/servicos
Authorization: Bearer <token>
Accept: application/json
Content-Type: application/json
```

```json
{"nome": "Manutenção elétrica", "categoria": "Elétrica", "descricao": "Reparo de instalações", "preco": 150.00, "ativo": true}
```

A resposta de serviço mantém o envelope `{ "mensagem": "...", "servico": { "id": ... } }`; avaliações/solicitações retornam o objeto do recurso. Clientes externos devem respeitar os formatos já usados e o inventário acima.

## 10. Configuração de produção e limites preservados

Configure `APP_URL` com a origem pública da API, `APP_DEBUG=false` e `VITE_API_URL=https://sua-api/api` **antes** do build do frontend, se frontend e API estiverem em origens diferentes. Configure o CORS do Laravel (`config/cors.php`) para a origem real do frontend; a lista de origens locais existente não autoriza automaticamente um novo domínio. Se compartilhar a origem, encaminhe `/api` e `/storage` ao Laravel e configure o fallback SPA para páginas do React.

O servidor deve expor somente `src/backend/public` como raiz web do Laravel, preservar o armazenamento das fotos e permitir escrita em `storage`/`bootstrap/cache`. Garanta limite de upload PHP compatível com imagens de até 2 MB e limite de POST maior que o arquivo e seu multipart.

As mudanças de autenticação são intencionais: integrações que gravavam em rotas antes públicas agora precisam de token; solicitações/avaliações/pagamentos respeitam titularidade. Serviço e vínculo serviço/autônomo continuam gerenciáveis por contas autenticadas, sem criação de um novo papel administrativo nesta revisão.

As preferências de tema, texto, contraste, idioma e notificações permanecem no `localStorage`, como antes; não foram transformadas em preferências sincronizadas entre dispositivos. Não foram criadas novas telas administrativas nem uma tela/gateway de pagamento inexistentes no projeto-base. A revisão garante os contratos de persistência da API e corrige os fluxos de salvamento apresentados pelo site, sem expandir ou redesenhar o produto.
