# Plano aprovado — FixItNow

## Escopo vigente

- Para visitantes, abrir o portal Sophia restaurado na URL `/`.
- Remover do banner Sophia o botão “Entrar ou cadastrar no FixItNow”; preservar o cartão “Nosso Site” nos links rápidos.
- Fazer o cartão “Nosso Site” apontar para `/acessar`, onde o visitante pode entrar ou iniciar o cadastro; após autenticação/cadastro, seguir ao app.
- Para usuários autenticados, `/` continua direcionando ao painel `/inicio`; a URL antiga `/sophia` redireciona para o fluxo inicial apropriado.
- Preservar a aparência original do portal no desktop, a adaptação móvel, o tema escuro padrão do FixItNow e os formulários existentes.
- A foto de perfil continua usando a API protegida e a migração Laravel já implementadas.

## Implementação da abertura

- `src/frontend/src/App.jsx`: renderizar Sophia para visitantes em `/`; manter `/acessar` para `Entrada`, encaminhar logados a `/inicio` e proteger rotas privadas.
- `src/frontend/src/Pages/Sophia/Sophia.jsx` e `LinksRapidos.jsx`: preservar o cartão “Nosso Site” apontando a `/acessar`.
- `src/frontend/src/Pages/Sophia/Banner.jsx`: manter o banner original sem botão extra de acesso.
- Em telas estreitas, ocultar a sidebar fixa e usar conteúdo em largura completa; atalhos quebram linha e comunicados ocupam a largura disponível; em desktop, manter a sidebar original.
- `src/frontend/public/manus-routes.json`: declarar `/` como Sophia e incluir `/acessar`.

## Foto de perfil

- Em `src/frontend/src/Pages/Perfil.jsx`, escolher/alterar imagem, com prévia, progresso e mensagens.
- `POST /api/perfil/foto` usa o token Sanctum e aceita JPEG, PNG ou WebP até 2 MB; atualiza apenas o perfil da conta autenticada.
- Persistir `foto_path` nas entidades de empresa/autônomo e fornecer URL pública `foto_url`; armazenar no disco Laravel `public` e documentar `php artisan migrate` e `php artisan storage:link`.
- Atualizar avatar do perfil e da navegação após o envio.

## Estrutura

- `src/frontend/src/lib/auth.js`: sessão, atualização reativa e normalização da URL de foto.
- `src/frontend/src/Components/BarraNav.jsx`: refletir o avatar novo.
- `src/backend/app/Http/Controllers/ProfilePhotoController.php`, modelos de perfil, migração e `routes/api.php`: upload autenticado e persistência.
- `src/backend/README.md` e `PROFILE_PHOTOS.md`: requisitos de ativação do armazenamento.

## Revisão de persistência — 21/10/2026
Preservar a arquitetura React/Vite + Laravel/Sanctum e todas as classes visuais, imagens, navegação, Sophia e preferências existentes. Integrar operações aparentes mas não ligadas à API, sem substituir o projeto nem introduzir serviços externos.

- Avaliações: selecionar solicitação concluída da empresa e enviar nota/comentários com ID real à API; verificar papel, propriedade, estado e unicidade. Edição conserva o vínculo.
- Chamados: migração aditiva para contato, local, tipo, prioridade e preço estimado; enviar campos já mostrados; nenhum sucesso sem resposta da API; limpar estado controlado e bloquear cliques repetidos durante envio.
- Perfil: descrição persistida no perfil autenticado e carregada do servidor; foto e demais campos permanecem.
- API: validar mutations, autenticar alterações, respeitar titularidade e sincronizar dados de login quando um perfil muda.
- Painel/histórico: substituir arrays simulados por dados autenticados e filtros reais, mantendo tabelas e cartões.
- Pedidos: atualizar status do pedido atribuído usando o ID numérico e a resposta do servidor.
- Pagamentos: vínculo aditivo à solicitação para novos registros; preservar antigos sem adivinhar associação. O endpoint registra dados, não realiza cobranças.
- Catálogo de perfis: conservar `created_by` do token em cadastros diretos, permitindo que o criador do tipo correto edite/exclua o registro sem deixar uma criação 201 impossível de gerenciar. Quando existir uma conta real vinculada, essa titularidade tem prioridade.

Controllers, modelos, migrações e testes permanecem nas pastas Laravel atuais. Integração e apresentação permanecem nas páginas e helpers React atuais. A entrega será um ZIP corrigido e um relatório Markdown completo, sem publicação em produção.
