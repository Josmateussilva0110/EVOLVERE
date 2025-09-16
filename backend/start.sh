#!/usr/bin/env sh

# Espera o PostgreSQL estar pronto
./wait-for-it.sh db

# Roda as migrations mais recentes
npx knex migrate:latest --knexfile knexfile.js

# Roda as seeds
npx knex seed:run --knexfile knexfile.js

# Inicia o servidor com nodemon
npm run dev
