# FixItNow — backend

API REST do FixItNow, construída com Laravel 12, PHP 8.2+ e Eloquent ORM.

## Executar

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

Para desenvolvimento local com MySQL (recomendado):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3310
DB_DATABASE=fixitnow
DB_USERNAME=root
DB_PASSWORD=
```

## Validar

```bash
php artisan route:list
php artisan test
```

As rotas da API ficam em `routes/api.php`, os controladores em `app/Http/Controllers`, os modelos em `app/Models` e as migrações em `database/migrations`.

## Fotos de perfil

A rota autenticada `POST /api/perfil/foto` recebe uma imagem JPEG, PNG ou WebP de até 2 MB no campo multipart `foto` e atualiza somente o perfil associado ao token Sanctum. Para habilitar a persistência das fotos, aplique as migrações e crie o link público do storage:

```bash
php artisan migrate
php artisan storage:link
```

Configure `APP_URL` como a origem pública da API e `VITE_API_URL` como a URL-base da API (incluindo `/api`, se aplicável) ao compilar o frontend. Veja [PROFILE_PHOTOS.md](PROFILE_PHOTOS.md) para detalhes.

## Segurança

O arquivo `.env` é local e não deve ser versionado. Endpoints devem validar os dados recebidos e persistir somente campos permitidos.

## Revisão de persistência de 21/10/2026

Todas as mutations usam `Authorization: Bearer <token>` e `Accept: application/json`, exceto cadastro/login. Solicitações, avaliações e pagamentos também têm leitura autenticada com escopo. Leituras do catálogo continuam públicas.

- `GET /api/perfil`: recupera o próprio perfil atualizado.
- `PUT /api/perfil`: recebe `descricao` (nullable, máximo 5000 caracteres) e salva no próprio perfil.
- `POST /api/avaliacoes`: recebe `id_solicitacao`, `nota` (1–5) e `comentarios` opcionais; somente empresa dona de solicitação concluída/finalizada. Duplicação retorna 409.
- `PUT /api/avaliacoes/{id}`: atualiza nota/comentários e conserva o vínculo.
- `POST /api/pagamentos`: exige `id_solicitacao`, `valor` e `metodo`; somente empresa dona. Não executa cobrança.
- Cadastro direto de empresa/autônomo pelo catálogo conserva o criador (`created_by`), permitindo seu CRUD; cadastro com login continua em `/api/auth/.../cadastro`.

Veja [RELATORIO_FINAL.md](../../RELATORIO_FINAL.md) para o inventário completo, regras e alterações por arquivo. As migrações são aditivas e compatíveis com MySQL. Em bases existentes, faça backup e execute `php artisan migrate`; não use `migrate:fresh`, não use `db:wipe` e não gere uma nova `APP_KEY`. Consulte [MYSQL_SETUP.md](MYSQL_SETUP.md) para preencher o `.env` real.
