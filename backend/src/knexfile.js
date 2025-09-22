const path = require('path');
require('dotenv').config({ path: '../.env' });

/**
 * Configuração do Knex para diferentes ambientes.
 * Atualmente configurado apenas para desenvolvimento com PostgreSQL.
 * 
 * @module knexfile
 * 
 * @typedef {Object} KnexEnvironment
 * @property {string} client - Cliente do banco de dados (ex: 'pg' para PostgreSQL)
 * @property {Object} connection - Configurações de conexão
 * @property {string} connection.host - Endereço do servidor do banco
 * @property {string} connection.user - Usuário do banco
 * @property {string} connection.password - Senha do banco
 * @property {string} connection.database - Nome do banco
 * @property {Object} migrations - Configuração das migrations
 * @property {string} migrations.tableName - Nome da tabela de migrations
 * @property {string} migrations.directory - Diretório das migrations
 * @property {Object} seeds - Configuração das seeds
 * @property {string} seeds.directory - Diretório das seeds
 * @property {string} timezone - Fuso horário utilizado pelo Knex
 */

/**
 * Exporta configuração do Knex para diferentes ambientes.
 * Para mais ambientes (produção, teste) basta adicionar chaves correspondentes.
 * 
 * @type {{development: KnexEnvironment}}
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'seeds')
    },
    timezone: 'America/Sao_Paulo'
  }
}
