# Configuração do banco MySQL

A aplicação está configurada para usar MySQL por padrão. O arquivo `.env` real não foi incluído no pacote recebido: a versão 1 tinha somente `.env.example`, também configurado para SQLite.

Na pasta `src/backend`, faça:

```bash
cp .env.mysql.example .env
php artisan key:generate
php artisan config:clear
php artisan migrate
```

Edite o `.env` antes de migrar e informe os dados reais do seu servidor:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3310
DB_DATABASE=fixitnow
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

O banco `fixitnow` precisa existir e o usuário precisa ter permissão para criar e alterar tabelas. Em produção, preserve o `APP_KEY` já existente, faça backup do banco e execute apenas `php artisan migrate`; não use `migrate:fresh` nem `db:wipe`.

A configuração de testes do PHPUnit continua usando SQLite em memória de propósito e não altera o banco de desenvolvimento ou produção.
