function formatDate(dateString) {
  const date = new Date(dateString)
  const dia = String(date.getUTCDate()).padStart(2, "0")
  const mes = String(date.getUTCMonth() + 1).padStart(2, "0")
  const ano = date.getUTCFullYear()
  const horas = String(date.getUTCHours()).padStart(2, "0")
  const minutos = String(date.getUTCMinutes()).padStart(2, "0")
  const segundos = String(date.getUTCSeconds()).padStart(2, "0")

  return `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`
}

export default formatDate
