const knex = require("../database/connection"); // Certifique-se que o caminho para sua conexão knex está correto

/**
 * Classe para manipulação de dados relacionados a Convites (Invites) na base de dados.
 * Interage com a tabela 'classes_invites'.
 * @class
 */
class Invite {

    /**
     * Busca um convite específico pelo seu código único.
     * @static
     * @async
     * @param {string} code - O código do convite (ex: "ABC-123").
     * @returns {Promise<Object|undefined>} Retorna o objeto do convite se encontrado, caso contrário `undefined`.
     * @example
     * const invite = await Invite.findByCode("XYZ-789");
     * if (invite) {
     * console.log("Convite encontrado para a turma:", invite.classes_id);
     * }
     */
    static async findByCode(code) {
        try {
            // Busca na tabela 'classes_invites' onde a coluna 'code' corresponda ao parâmetro
            const result = await knex('classes_invites')
                .where({ code: code })
                .first(); // .first() retorna o primeiro resultado encontrado ou undefined

            return result;
        } catch (err) {
            console.error('Erro ao buscar convite por código:', err);
            // Retorna undefined em caso de erro para indicar falha na busca
            return undefined;
        }
    }

    /**
     * Cria um novo registro de convite na base de dados.
     * @static
     * @async
     * @param {Object} data - Dados do novo convite.
     * @param {string} data.code - O código único gerado.
     * @param {number} data.classes_id - O ID da turma associada.
     * @param {Date} data.expires_at - A data e hora de expiração.
     * @param {number|null} data.max_uses - O número máximo de usos (ou null para ilimitado).
     * @returns {Promise<Object|undefined>} Retorna o objeto do convite recém-criado com todos os campos (incluindo ID e timestamps). Retorna `undefined` em caso de erro.
     * @example
     * const newInviteData = {
     * code: "NEW-CODE",
     * classes_id: 1,
     * expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira em 7 dias
     * max_uses: 50
     * };
     * const createdInvite = await Invite.create(newInviteData);
     * if (createdInvite) {
     * console.log("Convite criado com ID:", createdInvite.id);
     * }
     */
    static async create(data) {
        try {
            // Insere os dados na tabela 'classes_invites'
            const [newInvite] = await knex('classes_invites')
                .insert({
                    code: data.code,
                    classes_id: data.classes_id, // Confirme se o nome da coluna está correto
                    expires_at: data.expires_at,
                    max_uses: data.max_uses,
                    // created_at e updated_at são gerenciados pelo banco (timestamps(true, true))
                    // use_count tem default 0
                })
                .returning('*'); // .returning('*') faz o insert retornar o objeto completo criado

            return newInvite;
        } catch (err) {
            console.error('Erro ao criar convite:', err);
            // Retorna undefined em caso de erro na inserção
            return undefined;
        }
    }

    // --- Métodos Adicionais (podem ser úteis) ---

    /**
     * Incrementa o contador de usos de um convite.
     * Útil quando um aluno usa o código com sucesso.
     * @static
     * @async
     * @param {number} id - O ID do convite a ser atualizado.
     * @returns {Promise<boolean>} Retorna `true` se a atualização foi bem-sucedida, `false` caso contrário.
     */
    static async incrementUseCount(id) {
        try {
            const updatedRows = await knex('classes_invites')
                .where({ id: id })
                .increment('use_count', 1); // Incrementa a coluna 'use_count' em 1

            return updatedRows > 0; // Retorna true se alguma linha foi afetada
        } catch (err) {
            console.error('Erro ao incrementar contador de usos do convite:', err);
            return false;
        }
    }

     /**
     * Busca um convite válido pelo código (não expirado e com usos disponíveis).
     * Útil para a tela onde o aluno insere o código.
     * @static
     * @async
     * @param {string} code - O código do convite.
     * @returns {Promise<Object|null>} O objeto do convite se for válido, null caso contrário.
     */
    static async findValidByCode(code) {
        try {
            const invite = await knex('classes_invites')
                .where({ code: code })
                .andWhere('expires_at', '>', new Date()) // Verifica se ainda não expirou
                // Verifica se max_uses é NULL (ilimitado) OU se use_count < max_uses
                .andWhere(function() {
                    this.whereNull('max_uses').orWhereRaw('use_count < max_uses')
                })
                .first();
            return invite || null; // Retorna null se não encontrar ou se for inválido
        } catch (err) {
            console.error('Erro ao buscar convite válido por código:', err);
            return null;
        }
    }

}

module.exports = Invite;