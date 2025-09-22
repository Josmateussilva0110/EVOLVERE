#!/usr/bin/env sh
set -e

# Host do banco de dados
DB_HOST=db

echo "Aguardando o PostgreSQL em $DB_HOST..."

# Espera o PostgreSQL estar pronto
until pg_isready -h "$DB_HOST" -p 5432 -U "$USER"; do
  echo "PostgreSQL ainda não está pronto..."
  sleep 2
done

echo "PostgreSQL pronto! Rodando migrations e seeds..."

# Roda as migrations mais recentes
npx knex migrate:latest --knexfile src/knexfile.js

# Roda as seeds
npx knex seed:run --knexfile src/knexfile.js

echo "Iniciando o servidor..."

# Inicia o servidor com nodemon
cd src
npx nodemon index.js --watch . --ext js,json

