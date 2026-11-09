# Configuração do banco MySQL

A aplicação usa MySQL. O pacote já traz um `.env` configurado com:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3310
DB_DATABASE=fixitnow
DB_USERNAME=root
DB_PASSWORD=1234
```

Na pasta `src/backend`:

```bash
composer install
mysql -h 127.0.0.1 -P 3310 -u root -p1234 < database/create_database.sql
php artisan config:clear
php artisan migrate
php artisan storage:link
```

O banco `fixitnow` precisa existir antes do `migrate`; o script `database/create_database.sql` o cria. As migrações criam as tabelas e cadastram os serviços padrão. Em um ambiente já em uso, faça backup e execute apenas `php artisan migrate`; não use `migrate:fresh` nem `db:wipe`.

Se o `.env` for recriado, copie `.env.mysql.example` para `.env` e gere a chave com `php artisan key:generate`.

A configuração de testes do PHPUnit continua usando SQLite em memória de propósito e não altera o banco de desenvolvimento ou produção.
