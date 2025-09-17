const XLSX = require("xlsx")
const path = require("path")

exports.seed = async function (knex) {
  const filePath = path.resolve(__dirname, "../public/course_valid.xlsx")
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0] 
  const sheet = workbook.Sheets[sheetName]

  const rows = XLSX.utils.sheet_to_json(sheet)

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

  await knex("course_valid")
    .insert(courses)
    .onConflict("course_code") // evita duplicar pelo código do curso
    .ignore()
}
