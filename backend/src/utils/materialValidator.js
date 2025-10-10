const validator = require('validator')

/**
 * Classe responsável por validar campos do material.
 * Cada método retorna uma mensagem de erro caso a validação falhe, ou `null` se estiver válido.
 * 
 * Campos suportados:
 * - title
 * - description
 * - type
 * - archive
 * - created_by
 * - subject_id
 * - class_id
 * - status
 * 
 * @example
 * const error = MaterialFieldValidator.validate({
 *   title: "Aula 01 - Introdução",
 *   description: "Material introdutório de redes",
 *   type: 1,
 *   archive: "aula01.pdf",
 *   created_by: 5,
 *   subject_id: 2
 * })
 */
class MaterialFieldValidator {

  /**
   * Valida o título do material.
   * @param {string} title - Título do material.
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static title(title) {
    if (validator.isEmpty(title || '')) {
      return 'Título obrigatório.'
    }
    if (!validator.isLength(title, { min: 3, max: 150 })) {
      return 'Título deve ter entre 3 e 150 caracteres.'
    }
    return null
  }

  /**
   * Valida a descrição do material.
   * @param {string} description - Descrição do material.
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static description(description) {
    if (description && !validator.isLength(description, { max: 255 })) {
      return 'Descrição deve ter no máximo 255 caracteres.'
    }
    return null
  }

  /**
   * Valida o tipo do material.
   * @param {number|string} type - Tipo do material (ex: 1=PDF, 2=Vídeo...).
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static type(type) {
    if (validator.isEmpty(type + '')) {
      return 'Tipo obrigatório.'
    }
    if (!validator.isInt(type + '', { min: 1 })) {
      return 'Tipo inválido.'
    }
    return null
  }


  /**
   * Valida o ID do usuário criador do material.
   * @param {number|string} created_by - ID do criador.
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static created_by(created_by) {
    if (!validator.isInt(created_by + '', { min: 1 })) {
      return 'ID do criador inválido.'
    }
    return null
  }

  /**
   * Valida o ID da disciplina associada.
   * @param {number|string} subject_id - ID da disciplina.
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static subject_id(subject_id) {
    if (!validator.isInt(subject_id + '', { min: 1 })) {
      return 'ID da disciplina inválido.'
    }
    return null
  }

  /**
   * Valida o ID da turma (opcional).
   * @param {number|string|null} class_id - ID da turma.
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static class_id(class_id) {
    if (class_id != null && !validator.isInt(class_id + '', { min: 1 })) {
      return 'ID da turma inválido.'
    }
    return null
  }


  /**
   * Valida múltiplos campos de material.
   * Retorna a primeira mensagem de erro encontrada ou `null` se todos forem válidos.
   * 
   * @param {Object} fields - Objeto com campos a validar.
   * @returns {string|null} Mensagem de erro ou `null` se válido.
   */
  static validate(fields) {
    for (const [field, value] of Object.entries(fields)) {
      let error = null

      switch (field) {
        case 'title':
          error = MaterialFieldValidator.title(value)
          break
        case 'description':
          error = MaterialFieldValidator.description(value)
          break
        case 'type':
          error = MaterialFieldValidator.type(value)
          break
        case 'created_by':
          error = MaterialFieldValidator.created_by(value)
          break
        case 'subject_id':
          error = MaterialFieldValidator.subject_id(value)
          break
        case 'class_id':
          error = MaterialFieldValidator.class_id(value)
          break
        default:
          return `Validação para '${field}' não implementada.`
      }

      if (error) return error
    }

    return null // sem erros
  }
}

module.exports = MaterialFieldValidator
