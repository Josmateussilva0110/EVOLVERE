#!/usr/bin/env sh
set -e

echo "Aguardando o PostgreSQL em $DB_HOST..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "PostgreSQL ainda não está pronto..."
  sleep 2
done

echo "PostgreSQL pronto! Rodando migrations e seeds..."

npx knex migrate:latest --knexfile src/knexfile.js
npx knex seed:run --knexfile src/knexfile.js

echo "Iniciando o servidor..."

cd src
node index.js
