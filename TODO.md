# Entregas

## Sophia como abertura para visitantes [x]
- Ao abrir `/` sem sessão, mostrar o portal Sophia restaurado.
- Remover do banner Sophia o botão “Entrar ou cadastrar no FixItNow”.
- Manter o cartão “Nosso Site” em Links rápidos; ele abre `/acessar`, onde há as opções de entrar ou cadastrar, e o fluxo autenticado/cadastrado leva ao app.
- Quando houver sessão autenticada, `/` continua direcionando ao painel `/inicio`; as rotas privadas seguem protegidas.
- A rota antiga `/sophia` encaminha ao fluxo inicial apropriado sem criar uma segunda página Sophia.
- Em celular, o conteúdo do portal e os atalhos ficam visíveis, sem serem cortados pela sidebar fixa.

## Tema e cadastro preservados [x]
- O tema escuro continua sendo o padrão; a preferência clara antiga migra uma vez para escuro e escolhas posteriores persistem.
- Seleção do tipo, cadastro de empresa e cadastro de autônomo mantêm campos e validações com visual alinhado ao login; as outras páginas não são redesenhadas.

## Foto de perfil [x]
- Perfil permite escolher ou trocar foto da própria conta autenticada, com prévia e mensagens de progresso, sucesso e erro.
- Aceita JPEG, PNG ou WebP até 2 MB, persiste no perfil de empresa ou autônomo e exibe o avatar atualizado no perfil e na navegação, inclusive após novo login.
- Implementação frontend/backend, migração e documentação concluídas; lint, build e sintaxe PHP verificados.

## Procedimento de ativação do backend de fotos [x]
- No ambiente do backend, executar `php artisan migrate` e `php artisan storage:link` e configurar `APP_URL` e `VITE_API_URL`.
- Migração, upload e storage foram validados em banco isolado nesta revisão. A SQLite enviada foi preservada; executar os comandos documentados no ambiente do usuário antes de iniciar o site.

## Recursos anteriores preservados [x]
- A página inicial V1 continua em `/site` após autenticação.
- O botão autenticado alterna para login do outro tipo sem trocar a sessão antes de validar o perfil.
- Avaliações seguem exclusivas para empresa; pedidos seguem exclusivos para autônomo; tokens e permissões seguem específicos por tipo.

## Persistência e revisão da API — 21/10/2026 [x]
- Corrigir o sistema de avaliação para salvar corretamente na API, vinculando a uma solicitação concluída da empresa autenticada, com nota e comentários, sem duplicação ou falsa confirmação de sucesso.
- Fazer uma revisão completa de todas as rotas da API e corrigir salvamentos incompletos, validações e vínculos inconsistentes.
- Persistir todos os campos do novo chamado e a descrição do próprio perfil; mostrar solicitações reais no painel/histórico; permitir atualização do andamento dos pedidos atribuídos.
- Preservar as outras funções, o portal Sophia, cadastro/login, foto, preferências locais de acessibilidade e o design existente; só acrescentar controles necessários aos fluxos incompletos.
- Gerar relatório final com alterações por arquivo, inventário de rotas, evidências de validação e instruções de execução e atualização sem destruir os dados existentes.
- Evidências: 26 testes Laravel (238 assertions), 4 testes Node, lint/build, migração nova e sobre cópia da SQLite, teste ponta a ponta com API real e confirmação direta de avaliação no banco isolado. Relatório em `RELATORIO_FINAL.md`.
