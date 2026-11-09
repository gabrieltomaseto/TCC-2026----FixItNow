# Fotos de perfil

O backend salva a foto da própria conta autenticada em `storage/app/public/profile-photos/{user_id}`. A rota `POST /api/perfil/foto` exige token Sanctum e o campo multipart `foto`; aceita JPEG, PNG ou WebP, com limite de 2 MB. O avatar pertence ao perfil de empresa ou autônomo associado ao token.

Depois de instalar o código, aplique a migração aditiva e publique o storage do disco `public`:

```bash
php artisan migrate
php artisan storage:link
```

Configure `APP_URL` como a origem pública da API no backend e `VITE_API_URL` como a URL-base da API (incluindo `/api`, se aplicável) ao compilar o frontend. O campo `foto_url` retornado no login/cadastro e no upload é usado no perfil e na navegação.

As fotos também são entregues pela rota pública `GET /api/fotos/{usuario}/{arquivo}`, que lê o disco `public` diretamente. O front-end usa essa rota primeiro e só recorre a `/storage/...` se ela falhar, então a foto aparece mesmo sem o `php artisan storage:link`.
