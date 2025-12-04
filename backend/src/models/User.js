const knex = require("../database/connection")

/**
 * Modelo de Usuário.
 * Responsável por interagir com a tabela `users` no banco de dados.
 * Fornece métodos para salvar, buscar e validar usuários.
 * @class
 */
class User {

    /**
     * Salva um novo usuário no banco de dados.
     *
     * @async
     * @param {Object} data - Dados do usuário a serem salvos.
     * @param {string} data.username - Nome do usuário.
     * @param {string} data.email - Email do usuário.
     * @param {string} data.password - Hash da senha.
     * @param {string} data.registration - Matrícula única do usuário.
     * @returns {Promise<boolean>} Retorna `true` se salvo com sucesso, senão `false`.
     *
     * @example
     * const success = await User.save({
     *   username: "mateus",
     *   email: "mateus@email.com",
     *   password: "<hash>",
     *   registration: "12345678"
     * })
     */
    async save(data) {
        try {
            await knex("users").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar usuário:', err)
            return false
        }
    }

    /**
     * Verifica se um email já está cadastrado.
     *
     * @async
     * @param {string} email - Email a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se já existir, senão `false`.
     *
     * @example
     * const exists = await User.emailExists("mateus@email.com")
     * // exists === true ou false
     */
    async emailExists(email) {
        try {
            const result = await knex.select(["email"]).where({email}).table("users")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar email:', err)
            return false
        }
    }

    /**
     * Verifica se uma matrícula (registration) já existe.
     *
     * @async
     * @param {string} code - Código de matrícula.
     * @returns {Promise<boolean>} Retorna `true` se já existir, senão `false`.
     *
     * @example
     * const exists = await User.registrationExists("12345678")
     * // exists === true ou false
     */
    async registrationExists(code) {
        try {
            const result = await knex.select(["registration"]).where({registration: code}).table("users")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar matrícula:', err)
            return false
        }
    }

    /**
     * Busca um usuário pelo email.
     *
     * @async
     * @param {string} email - Email do usuário.
     * @returns {Promise<Object|undefined>} Retorna o usuário encontrado ou `undefined` se não existir.
     *
     * @example
     * const user = await User.findByEmail("mateus@email.com")
     * // user = { id, username, email, registration, password, ... } ou undefined
     */
    async findByEmail(email) {
        try {
            const result = await knex.raw(`
                select 
                    u.id, 
                    u.username,
                    u.email,
                    u.registration,
                    u.password,
                    u.photo,
                    u.status,
                    u.created_at,
                    u.updated_at,
                    vp.role
                from users u
                left join validate_professionals vp
                    on vp.professional_id = u.id
                where u.email = ?
            `, [email])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao buscar usuário por email:', err)
            return undefined
        }
    }

    /**
     * Busca um usuário pelo ID.
     *
     * @async
     * @param {number} id - ID do usuário.
     * @returns {Promise<Object|undefined>} Retorna o usuário encontrado ou `undefined` se não existir.
     *
     * @example
     * const user = await User.findById(1)
     * // user = { id, username, email, registration, photo, created_at, updated_at } ou undefined
     */
    async findById(id) {
        try {
        const result = await knex.raw(`
            select 
                u.id, 
                u.username,
                u.email,
                u.registration,
                u.photo,
                u.password,
                u.status,
                u.created_at,
                u.updated_at,
                u.course_id,
                vp.access_code
            CASE 
                when vp.role = '1' then 'Admin'
                when vp.role = '2' then 'Coordenador'
                when vp.role = '3' then 'Professor'
                when vp.role = '4' then 'Aluno'
                ELSE 'Aluno'
            END AS role
            from users u
            left join validate_professionals vp
                on vp.professional_id = u.id
            where u.id = ?
        `, [id])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao buscar usuário por id:', err)
            return undefined
        }
    }


    /**
     * Busca todos os alunos, excluindo:
     * 1. Usuários com registration 'admin'.
     * 2. TODOS os usuários que estão na tabela 'validate_professionals'.
     * @returns {Promise<Object[]>} - Uma lista de usuários que são apenas alunos.
     */
    async findAllStudents() {
        try {
            const students = await knex('users')
                .select(
                    'users.id', 
                    'users.username', 
                    'users.registration',
                    'users.email', 
                    'users.status', 
                    'users.created_at'
                )
                
                // FILTRO 1: Aqui está o "negócio dos admins".
                // A consulta primeiro remove qualquer usuário que seja 'admin'.
                .whereNot('registration', 'admin')
                
                // FILTRO 2: E aqui entra a linha que você mencionou.
                // Dos usuários que sobraram, a consulta remove todos que estão na
                // lista de profissionais.
                .whereNotIn('id', function() {
                    this.select('professional_id').from('validate_professionals');
                });
                
            return students;
        } catch (err) {
            console.error("Erro ao buscar alunos:", err);
            return [];
        }
    }

    async findAllStudentsByCoordinator(access_code) {
        try {
            const result = await knex.raw(`
                SELECT 
                    u.id,
                    u.username,
                    u.registration,
                    u.email,
                    u.status,
                    u.created_at
                FROM users u
                
                INNER JOIN course_valid cv
                    ON cv.course_code::text = ?
                
                WHERE u.course_id = cv.id
                
                -- exclui usuários que são profissionais validados
                AND NOT EXISTS (
                    SELECT 1
                    FROM validate_professionals vp
                    WHERE vp.professional_id = u.id
                )
                
                -- exclui registro 'admin'
                AND u.registration <> 'admin'
                
                ORDER BY u.username ASC;
            `, [access_code])

            return result.rows || []
        } catch (err) {
            console.error("Erro ao buscar alunos:", err)
            return []
        }
    }


    /**
     * @param {number} id - O ID do utilizador a ser apagado.
     * @returns {Promise<boolean>} - Retorna true se foi bem-sucedido.
     */
    async deleteById(id) {
        try {
            const deleted = await knex('users').where({ id }).delete();
            return deleted > 0;
        } catch (err) {
            console.error("Erro ao apagar utilizador:", err);
            return false;
        }
    }

    /**
     * Verifica se um usuário é administrador pelo ID.
     * 
     * @async
     * @function isAdmin
     * @param {string|number} id - ID do usuário a ser verificado.
     * 
     * @returns {Promise<Object|boolean>} Retorna o objeto do usuário se for admin,
     *  ou `false` caso o usuário não seja admin ou ocorra algum erro.
     * 
     * @example
     * const admin = await isAdmin(123);
     * if (admin) {
     *   console.log("Usuário é admin:", admin.username);
     * } else {
     *   console.log("Usuário não é admin");
     * }
     */
    async isAdmin(id) {
        try {
            const result = await knex.raw(`
                select 
                    *
                from users
                where registration = 'admin' and id = ?
            `, [id])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : false
        } catch (err) {
            console.error("Erro ao buscar admin:", err)
            return false
        }
    }


    /**
     * Atualiza a foto de um usuário.
     * 
     * @async
     * @function updatePhoto
     * @param {string|number} id - ID do usuário que terá a foto atualizada.
     * @param {string} photoPath - Caminho ou URL da nova foto do usuário.
     * 
     * @returns {Promise<boolean>} Retorna `true` se a atualização foi bem-sucedida,
     *  ou `false` caso não tenha conseguido atualizar ou ocorra algum erro.
     * 
     * @example
     * const success = await updatePhoto(123, "/uploads/profile123.jpg");
     * if (success) {
     *   console.log("Foto atualizada com sucesso!");
     * } else {
     *   console.log("Falha ao atualizar foto.");
     * }
     */
    async updatePhoto(id, photoPath) {
        try {
            const updated_at = knex.fn.now()
            const result = await knex("users")
                .where({ id })
                .update({ photo: photoPath, updated_at})
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar foto:", err)
            return false
        }
    }


    /**
     * Busca a foto de um usuário pelo ID.
     * 
     * @async
     * @function findPhoto
     * @param {string|number} id - ID do usuário cuja foto será buscada.
     * 
     * @returns {Promise<Object|undefined>} Retorna um objeto com a propriedade `photo`
     *  caso o usuário seja encontrado, ou `undefined` caso não exista ou ocorra algum erro.
     * 
     * @example
     * const userPhoto = await findPhoto(123);
     * if (userPhoto) {
     *   console.log("Caminho da foto:", userPhoto.photo);
     * } else {
     *   console.log("Usuário não encontrado ou sem foto.");
     * }
     */
    async findPhoto(id) {
        try {
            const result = await knex.select(["photo"]).where({id}).table("users")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch (err) {
            console.error("Erro ao atualizar foto:", err)
            return undefined
        }
    }


    /**
     * Remove a foto de um usuário, definindo o campo `photo` como `null`.
     * 
     * @async
     * @function deletePhoto
     * @param {string|number} id - ID do usuário cuja foto será removida.
     * 
     * @returns {Promise<boolean>} Retorna `true` se a remoção foi bem-sucedida,
     *  ou `false` caso não tenha conseguido atualizar ou ocorra algum erro.
     * 
     * @example
     * const success = await deletePhoto(123);
     * if (success) {
     *   console.log("Foto removida com sucesso!");
     * } else {
     *   console.log("Falha ao remover foto.");
     * }
     */
    async deletePhoto(id) {
        try {
            const updated_at = knex.fn.now()
            const result = await knex("users")
                .where({ id })
                .update({ photo: null, updated_at})
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar foto:", err)
            return false
        }
    }


    /**
     * Busca a sessão ativa de um usuário pelo ID.
     * 
     * @async
     * @function findSessionById
     * @param {string|number} id - ID do usuário cuja sessão será buscada.
     * 
     * @returns {Promise<Object|undefined>} Retorna um objeto com a propriedade `expire`
     *  representando a data de expiração da sessão, ou `undefined` caso não haja sessão ativa
     *  ou ocorra algum erro.
     * 
     * @example
     * const session = await findSessionById(123);
     * if (session) {
     *   console.log("Sessão expira em:", session.expire);
     * } else {
     *   console.log("Nenhuma sessão ativa encontrada.");
     * }
     */
    async findSessionById(id) {
        try {
            const result = await knex('session')
            .select('expire')
            .whereRaw(`sess->'user'->>'id' = ?`, [String(id)])
            .andWhere('expire', '>', knex.fn.now())
            .orderBy('expire', 'asc')
            .first()
            return result
        } catch (err) {
            console.error("Erro ao buscar sessão:", err)
            return undefined
        }
    }


    /**
     * Atualiza os dados de um usuário.
     * 
     * @async
     * @function updateUser
     * @param {string|number} id - ID do usuário que será atualizado.
     * @param {Object} data - Objeto contendo os campos a serem atualizados.
     * 
     * @returns {Promise<boolean>} Retorna `true` se a atualização foi bem-sucedida,
     *  ou `false` caso não tenha conseguido atualizar ou ocorra algum erro.
     * 
     * @example
     * const success = await updateUser(123, { username: "novoNome", email: "novo@email.com" });
     * if (success) {
     *   console.log("Usuário atualizado com sucesso!");
     * } else {
     *   console.log("Falha ao atualizar usuário.");
     * }
     */
    async updateUser(id, data) {
        try {
            data.updated_at = knex.fn.now()
            const result = await knex("users")
                .where({ id })
                .update({ ...data })
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar usuário:", err)
            return false
        }
    }


    async updateCourse(id, data) {
        try {
            data.updated_at = knex.fn.now()
            const result = await knex("users")
                .where({ id })
                .update({ ...data })
            return result > 0
        } catch (err) {
            console.error("Erro ao atualizar curso do usuário:", err)
            return false
        }
    }

    
}

module.exports = new User()
