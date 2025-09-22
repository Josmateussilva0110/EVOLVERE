const validator = require('validator')

class UserFieldValidator {

    static username(username) {
        if (validator.isEmpty(username || '')) {
            return 'Nome obrigatório.'
        }
        if (!validator.isLength(username, { min: 3, max: 50 })) {
            return 'Nome deve ter entre 3 e 50 caracteres.'
        }
        return null
    }

    static registration(registration) {
        if (validator.isEmpty(registration || '')) {
            return 'Matricula obrigatório.'
        }
        if (!validator.isNumeric(registration) || !validator.isLength(registration, { min: 11, max: 11 })) {
            return 'Matrícula inválida.'
        }

        return null
    }

    static email(email) {
        if (validator.isEmpty(email || '')) {
            return 'Email obrigatório.'
        }
        if (!validator.isEmail(email)) {
            return 'Email inválido.'
        }
        return null
    }

    static password(password) {
        if (validator.isEmpty(password || '')) {
            return 'Senha obrigatória.'
        }
        if (!validator.isLength(password, { min: 6 })) {
            return 'Senha deve ter no mínimo 6 caracteres.'
        }
        return null
    }


    static confirmPassword(password, confirm_password) {
        if (validator.isEmpty(confirm_password || '')) {
            return 'Confirmação de senha obrigatória.'
        }
        if (password !== confirm_password) {
            return 'Senhas precisam ser iguais.'
        }
        return null
    }

    static id(id) {
        if (!validator.isInt(id + '', { min: 1 })) {
            return 'ID inválido.'
        }
        return null
    }

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
