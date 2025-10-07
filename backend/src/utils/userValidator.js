const validator = require('validator')

/**
 * Classe responsável por validar campos de usuário.
 * Cada método retorna uma mensagem de erro caso a validação falhe, ou `null` se estiver válido.
 * 
 * Campos suportados: 
 * - username
 * - registration
 * - email
 * - password
 * - confirm_password
 * - id
 * 
 * @example
 * const error = UserFieldValidator.validate({
 *   username: "João",
 *   email: "joao@email.com",
 *   password: "123456",
 *   confirm_password: "123456"
 * })
 */
class UserFieldValidator {

    /**
     * Valida o nome de usuário.
     * @param {string} username - Nome do usuário.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static username(username) {
        if (validator.isEmpty(username || '')) {
            return 'Nome obrigatório.'
        }
        if (!validator.isLength(username, { min: 3, max: 50 })) {
            return 'Nome deve ter entre 3 e 50 caracteres.'
        }
        return null
    }

    /**
     * Valida a matrícula do usuário.
     * @param {string|number} registration - Matrícula do usuário.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static registration(registration) {
        if (validator.isEmpty(registration || '')) {
            return 'Matrícula obrigatória.'
        }
        if (!validator.isNumeric(registration) || !validator.isLength(registration, { min: 11, max: 11 })) {
            return 'Matrícula inválida.'
        }
        return null
    }

    /**
     * Valida o email do usuário.
     * @param {string} email - Email do usuário.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static email(email) {
        if (validator.isEmpty(email || '')) {
            return 'Email obrigatório.'
        }
        if (!validator.isEmail(email)) {
            return 'Email inválido.'
        }
        return null
    }

    /**
     * Valida a senha do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static password(password) {
        if (validator.isEmpty(password || '')) {
            return 'Senha obrigatória.'
        }
        if (!validator.isLength(password, { min: 6 })) {
            return 'Senha deve ter no mínimo 6 caracteres.'
        }
        return null
    }

    /**
     * Valida a senha do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static current_password(password) {
        if (validator.isEmpty(password || '')) {
            return 'Senha obrigatória.'
        }
        if (!validator.isLength(password, { min: 6 })) {
            return 'Senha deve ter no mínimo 6 caracteres.'
        }
        return null
    }

    /**
     * Valida a confirmação de senha.
     * @param {string} password - Senha original.
     * @param {string} confirm_password - Confirmação da senha.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static confirmPassword(password, confirm_password) {
        if (validator.isEmpty(confirm_password || '')) {
            return 'Confirmação de senha obrigatória.'
        }
        if (password !== confirm_password) {
            return 'Senhas precisam ser iguais.'
        }
        return null
    }

    /**
     * Valida o ID do usuário.
     * @param {number|string} id - ID do usuário.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     */
    static id(id) {
        if (!validator.isInt(id + '', { min: 1 })) {
            return 'ID inválido.'
        }
        return null
    }

    /**
     * Valida múltiplos campos de usuário.
     * Retorna a primeira mensagem de erro encontrada ou `null` se todos forem válidos.
     * 
     * Campos suportados: `username`, `registration`, `email`, `password`, `confirm_password`, `id`.
     * @param {Object} fields - Objeto com campos a validar.
     * @returns {string|null} Mensagem de erro ou `null` se válido.
     * 
     * @example
     * const error = UserFieldValidator.validate({
     *   username: "João",
     *   email: "joao@email.com",
     *   password: "123456",
     *   confirm_password: "123456"
     * })
     */
    static validate(fields) {
        for (const [field, value] of Object.entries(fields)) {
            let error = null

            switch (field) {
                case 'username':
                    error = UserFieldValidator.username(value)
                    break
                case 'registration':
                    error = UserFieldValidator.registration(value)
                    break
                case 'email':
                    error = UserFieldValidator.email(value)
                    break
                case 'password':
                    error = UserFieldValidator.password(value)
                    break
                case 'confirm_password':
                    error = UserFieldValidator.confirmPassword(fields.password, value)
                    break
                case 'current_password':
                    error = UserFieldValidator.current_password(value)
                    break
                case 'id':
                    error = UserFieldValidator.id(value)
                    break
                default:
                    return `Validação para '${field}' não implementada.`
            }

            if (error) {
                return error
            }
        }

        return null // sem erros
    }
}

module.exports = UserFieldValidator
