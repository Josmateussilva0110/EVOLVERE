const XLSX = require("xlsx")
const path = require("path")

/**
 * Seed para popular a tabela `course_valid` a partir de um arquivo Excel.
 * 
 * - Lê o arquivo `course_valid.xlsx` localizado em `public/`.
 * - Converte a primeira planilha em JSON.
 * - Insere os cursos na tabela `course_valid`.
 * - Evita duplicação utilizando `course_code` como chave única.
 * 
 * @async
 * @param {import('knex').Knex} knex - Instância do Knex configurada.
 * @returns {Promise<void>} Retorna uma promise resolvida quando a seed termina de inserir os cursos.
 * 
 * @example
 * // Executar a seed
 * npx knex seed:run --specific=course_valid_seed.js
 */
exports.seed = async function (knex) {
  // Caminho do arquivo Excel
  const filePath = path.resolve(__dirname, "../../public/course_valid.xlsx")
  
  // Lê o workbook
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0] 
  const sheet = workbook.Sheets[sheetName]

  // Converte planilha em JSON
  const rows = XLSX.utils.sheet_to_json(sheet)

  // Mapeia os campos para o formato da tabela
  const courses = rows.map(row => ({
    code_IES: row.code_IES,
    acronym_IES: row.acronym_IES,
    name_IES: row.name_IES,
    situation: row.situation,
    course_code: row.course_code,
    name: row.name,
    degree: row.degree,
    city: row.city,
    UF: row.UF
  }))

  // Insere cursos na tabela, ignorando duplicatas pelo course_code
  await knex("course_valid")
    .insert(courses)
    .onConflict("course_code")
    .ignore()
}
