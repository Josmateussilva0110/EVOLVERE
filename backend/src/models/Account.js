const knex = require("../database/connection")

/**
 * Classe responsável por gerenciar contas de profissionais.
 * @class
 */
class Account {

    /**
     * Salva uma nova conta de profissional na tabela `validate_professionals`.
     *
     * @async
     * @param {Object} data - Objeto contendo os dados do profissional.
     * @param {number} data.professional_id - ID do usuário/profissional.
     * @param {string} data.institution - Nome da instituição.
     * @param {string|number} data.access_code - Código de acesso válido.
     * @param {string} data.diploma - Caminho do arquivo PDF do diploma.
     * @param {string} data.role - Papel (role) do profissional.
     * @returns {Promise<boolean>} Retorna `true` se o cadastro for bem-sucedido, `false` caso ocorra algum erro.
     *
     * @example
     * const success = await Account.save({
     *   professional_id: 5,
     *   institution: "Universidade X",
     *   access_code: "123456",
     *   diploma: "diplomas/arquivo.pdf",
     *   role: "professor"
     * })
     * // success === true ou false
     */
    async save(data) {
        try {
            await knex("validate_professionals").insert(data)
            return true
        } catch(err) {
            console.error('Erro ao cadastrar conta de usuário:', err)
            return false
        }
    }

    /**
     * Verifica se uma conta de profissional existe na tabela `validate_professionals`.
     *
     * @async
     * @param {number|string} id - ID do profissional a ser verificado.
     * @returns {Promise<boolean>} Retorna `true` se a conta existir, `false` caso contrário ou em caso de erro.
     *
     * @example
     * const exists = await Account.accountExists(5)
     * // exists === true ou false
     */

async accountExists(id, role) {
    try {
        const roleStr = String(role);

        if (roleStr === '4') { 
            const user = await knex('users')
                .select('id')
                .where({ id: id })
                .whereNotNull('course_id')    
                .first();

            return !!user;

        } else {
            const result = await knex('validate_professionals')
                .select('professional_id')
                .where({ professional_id: id })
                .first();

            return !!result;
        }

    } catch(err) {
        console.error('Erro ao verificar existência da conta:', err);
        return false;
    }
}

    /**
     * Retorna todas as solicitações de aprovação de professores que ainda não foram aprovadas.
     *
     * @async
     * @returns {Promise<Array<Object>|undefined>} Retorna um array de objetos contendo:
     * - `diploma` - Nome do arquivo do diploma.
     * - `username` - Nome do usuário.
     * - `id` - ID do profissional.
     * - `course` - Nome do curso.
     * - `flag` - Sigla da instituição de ensino.
     * Retorna `undefined` se não houver solicitações ou em caso de erro.
     *
     * @example
     * const requests = await Account.getAllRequests()
     * if (requests) {
     *   console.log(requests)
     * }
     */
    async getAllRequests() {
        try {
            const result = await knex.raw(`
                select 
                    vp.diploma, 
                    u.username,
                    vp.professional_id as id,
                    vp.created_at,
                    case 
                        when vp.role = 2 then 'Coordenador'
                        when vp.role = 3 then 'Professor'
                        else 'Desconhecido'
                    end as role,
                    cv.name as course,
                    cv."acronym_IES" as flag
                from validate_professionals vp
                inner join users u
                    on u.id = vp.professional_id
                inner join course_valid cv
                    on cv.course_code::text = vp.access_code
                where vp.approved = false
                order by vp.updated_at desc
            `)
            const rows = result.rows
            return rows.length > 0 ? rows : []
        } catch(err) {
            console.error('Erro ao buscar requests:', err)
            return []
        }
    }

    /**
     * Busca todas as solicitações de validação de professores pendentes (não aprovadas)
     * associadas a um coordenador, filtradas pelo código de acesso (`access_code`).
     *
     * - Retorna apenas registros onde `approved = false` e `role = 3` (professores).
     * - Inclui informações adicionais como nome de usuário, curso e sigla da instituição.
     *
     * @async
     * @function getAllRequestsByCoordinator
     * @param {string} access_code - Código de acesso do coordenador para filtrar as solicitações.
     * @returns {Promise<Object[]>} Lista de solicitações pendentes no formato:
     * - `diploma` {string} - Parte do caminho do diploma (extraído por `split_part`).
     * - `username` {string} - Nome de usuário associado ao professor.
     * - `id` {number} - ID do professor (professional_id).
     * - `created_at` {string} - Data de criação da solicitação.
     * - `role` {string} - Papel do usuário (fixo em "Professor", mas pode retornar "Coordenador" ou "Desconhecido").
     * - `course` {string} - Nome do curso associado.
     * - `flag` {string} - Sigla da instituição (acrônimo da IES).
     * Retorna um array vazio (`[]`) se não houver registros ou em caso de erro.
     *
     * @example
     * // Consulta bem-sucedida
     * const requests = await getAllRequestsByCoordinator("2025ABC");
     * // Resultado:
     * [
     *   {
     *     "diploma": "12345.pdf",
     *     "username": "joao.silva",
     *     "id": 12,
     *     "created_at": "2025-09-21T14:35:00.000Z",
     *     "role": "Professor",
     *     "course": "Engenharia de Software",
     *     "flag": "UFPI"
     *   }
     * ]
     *
     * @example
     * // Nenhuma solicitação encontrada
     * const requests = await getAllRequestsByCoordinator("INVALIDO");
     * // Resultado:
     * []
     */
    async getAllRequestsByCoordinator(access_code) {
        try {
            const result = await knex.raw(`
                select 
                    vp.diploma, 
                    u.username,
                    vp.professional_id as id,
                    vp.created_at,
                    case 
                        when vp.role = 2 then 'Coordenador'
                        when vp.role = 3 then 'Professor'
                        else 'Desconhecido'
                    end as role,
                    cv.name as course,
                    cv."acronym_IES" as flag
                from validate_professionals vp
                inner join users u
                    on u.id = vp.professional_id
                inner join course_valid cv
                    on cv.course_code::text = vp.access_code
                where vp.approved = false and vp.role = 3 and vp.access_code = ?
                order by vp.updated_at desc
            `, [access_code])
            const rows = result.rows
            return rows.length > 0 ? rows : []
        } catch(err) {
            console.error('Erro ao buscar requests:', err)
            return []
        }
    }


    /**
     * Retorna todos os professores aprovados no sistema, incluindo informações de usuário,
     * disciplina e curso.
     *
     * - Filtra apenas registros com `role = 3` (professor) e `approved = true`.
     * - Retorna informações adicionais do professor, como disciplina atribuída e curso associado.
     *
     * @async
     * @function getAllTeachers
     * @returns {Promise<Object[]|undefined>} Lista de professores no formato:
     * - `professional_id` {number} - ID do professor.
     * - `username` {string} - Nome de usuário do professor.
     * - `disciplina` {string|null} - Nome da disciplina atribuída ao professor (pode ser null se não houver).
     * - `course` {string} - Nome do curso associado ao professor.
     * Retorna `undefined` se não houver registros ou em caso de erro.
     *
     * @example
     * const teachers = await getAllTeachers();
     * // Resultado:
     * [
     *   {
     *     "professional_id": 12,
     *     "username": "joao.silva",
     *     "disciplina": "Matemática",
     *     "course": "Engenharia de Software"
     *   },
     *   {
     *     "professional_id": 13,
     *     "username": "maria.souza",
     *     "disciplina": null,
     *     "course": "Ciência da Computação"
     *   }
     * ]
     */
    async getAllTeachers() {
        try {
            const result = await knex.raw(`
                SELECT 
                    vp.professional_id,
                    u.username,
                    u.registration,
                    u.photo,
                    cv.name AS course,
                    COALESCE(array_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS subjects
                FROM validate_professionals vp
                INNER JOIN users u
                    ON u.id = vp.professional_id
                LEFT JOIN subjects s
                    ON s.professional_id = vp.professional_id
                INNER JOIN course_valid cv
                    ON cv.course_code::text = vp.access_code
                WHERE vp.role = 3 AND vp.approved = true
                GROUP BY vp.professional_id, u.username, u.registration, u.photo, cv.name
            `)

            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error('Erro ao buscar professores:', err)
            return undefined
        }
    }




    /**
     * Remove uma solicitação de aprovação de professor pelo ID do profissional.
     *
     * @async
     * @param {number} id - ID do profissional cuja solicitação será removida.
     * @returns {Promise<boolean>} Retorna `true` se a exclusão foi bem-sucedida, `false` em caso de erro.
     *
     * @example
     * const deleted = await Account.deleteRequest(5)
     * // deleted === true ou false
     */
    async deleteRequest(id) {
        try {
            const result = await knex('users')
            .where({ id: id })
            .del()
            return result > 0
        } catch (err) {
            console.error('Erro ao remover request:', err)
            return false
        }
    }

    /**
     * Busca um coordenador acadêmico pelo seu ID.
     * 
     * Este método realiza uma consulta no banco de dados para obter informações detalhadas
     * de um coordenador, incluindo dados do usuário, instituição e curso associado.
     * 
     * Critérios da busca:
     * - A tabela `users` fornece dados básicos do usuário.
     * - A tabela `validate_professionals` deve ter `role = 2` (coordenador) e `approved = true`.
     * - A tabela `course_valid` fornece o nome do curso correspondente ao `access_code`.
     * 
     * @async
     * @function findCoordinatorById
     * @param {number} id - ID do usuário/coordenador a ser buscado.
     * @returns {Promise<Object|undefined>} Retorna um objeto com os dados do coordenador se encontrado,
     *                                      ou `undefined` caso não exista ou ocorra um erro.
     * 
     * @example
     * const coordinator = await findCoordinatorById(10);
     * if(coordinator) {
     *   console.log(coordinator.username, coordinator.course);
     * } else {
     *   console.log('Coordenador não encontrado.');
     * }
     */
    async findCoordinatorById(id) {
        try {
            const result = await knex.raw(`
                select 
                    u.id, 
                    u.username,
                    u.email,
                    u.registration,
                    u.status,
                    vp.institution,
                    vp.access_code,
                    cv.name as course,
                    cv.id as course_id
                from users u
                inner join validate_professionals vp
                    on vp.professional_id = u.id
                inner join course_valid cv
                    on cv.course_code::text = vp.access_code
                where u.id = ? and vp.role = 2 and vp.approved = true 
            `, [id]);
            
            const rows = result.rows;

            return rows.length > 0 ? rows[0] : undefined;
        } catch(err) {
            console.error('Erro ao buscar coordenador por id:', err);
            return undefined;
        }
    }

    /**
     * Busca professores validados (com join na tabela validate_professionals)
     */
    async findProfessoresValidados() {
        try {
            const result = await knex
                .select(
                    'users.id',
                    'users.username',
                    'users.email',
                    'users.registration',
                    'validate_professionals.institution',
                    'validate_professionals.role'
                )
                .from('users')
                .innerJoin('validate_professionals', 'users.id', 'validate_professionals.professional_id')
                .where({
                    'validate_professionals.role': 3,  // Professor
                    'validate_professionals.approved': true  // Aprovado
                })
                .andWhere('users.status', 1)  // Usuário ativo
            
            return result.length > 0 ? result : undefined;
        } catch(err) {
            console.error("Erro ao buscar professores validados:", err);
            return undefined;
        }
    }


    /**
     * Retorna todos os professores aprovados vinculados a um coordenador específico,
     * filtrados pelo código de acesso (`access_code`).
     *
     * - Filtra apenas registros com `role = 3` (professor) e `approved = true`.
     * - Retorna informações adicionais do professor, como disciplina atribuída e curso associado.
     *
     * @async
     * @function getAllTeachersByCoordinator
     * @param {string} access_code - Código de acesso do coordenador para filtrar os professores.
     * @returns {Promise<Object[]|undefined>} Lista de professores no formato:
     * - `professional_id` {number} - ID do professor.
     * - `username` {string} - Nome de usuário do professor.
     * - `disciplina` {string|null} - Nome da disciplina atribuída ao professor (pode ser null se não houver).
     * - `course` {string} - Nome do curso associado ao professor.
     * Retorna `undefined` se não houver registros ou em caso de erro.
     *
     * @example
     * const teachers = await getAllTeachersByCoordinator("2025ABC");
     * // Resultado:
     * [
     *   {
     *     "professional_id": 12,
     *     "username": "joao.silva",
     *     "disciplina": "Matemática",
     *     "course": "Engenharia de Software"
     *   },
     *   {
     *     "professional_id": 13,
     *     "username": "maria.souza",
     *     "disciplina": null,
     *     "course": "Ciência da Computação"
     *   }
     * ]
     */
    async getAllTeachersByCoordinator(access_code) {
        try {
            const result = await knex.raw(`
                select 
                    vp.professional_id,
                    u.username,
                    u.registration,
                    u.photo,
                    COALESCE(array_agg(s.name) FILTER (WHERE s.name IS NOT NULL), '{}') AS subjects,
                    cv.name as course
                from validate_professionals vp
                inner join users u
                    on u.id = vp.professional_id
                left join subjects s
                    on s.professional_id = vp.professional_id
                inner join course_valid cv
                    on cv.course_code::text = vp.access_code
                where vp.role = 3 and vp.approved = true and vp.access_code = ?
                GROUP BY vp.professional_id, u.username, u.registration, u.photo, cv.name
            `, [access_code])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error('Erro ao buscar coordenador por id:', err)
            return undefined
        }
    }

    /**
     * Aprova a solicitação de um professor definindo o campo `approved` como `true`.
     *
     * @async
     * @param {number} id - ID do profissional a ser aprovado.
     * @returns {Promise<boolean>} Retorna `true` se a aprovação foi bem-sucedida, `false` em caso de erro.
     *
     * @example
     * const approved = await Account.approveTeacher(5)
     * // approved === true ou false
     */
    async approveRequest(id) {
        try {
            const result = await knex('validate_professionals').where({professional_id: id }).update({approved: true})
            return result > 0
        } catch(err) {
            console.error('Erro ao aprovar request:', err)
            return false
        }
    }


    /**
     * Conta o número de professores aprovados vinculados a um coordenador específico,
     * filtrados pelo código de acesso (`access_code`).
     *
     * - Filtra apenas registros com `approved = true` e `role = 3` (professor).
     *
     * @async
     * @function countTeachers
     * @param {string} access_code - Código de acesso do coordenador para filtrar os professores.
     * @returns {Promise<Object|undefined>} Retorna um objeto com a contagem, por exemplo:
     * - `{ count: 12 }` se houver professores.
     * Retorna `undefined` se não houver registros ou em caso de erro.
     *
     * @example
     * const teacherCount = await countTeachers("2025ABC");
     * // Resultado:
     * { count: 12 }
     *
     * @example
     * // Nenhum professor encontrado
     * const teacherCount = await countTeachers("INVALIDO");
     * // Resultado:
     * undefined
     */
    async countTeachers(access_code) {
        try {
            const result = await knex.raw(`
                select 
                    count(*)
                from validate_professionals 
                where approved = true and role = 3 and access_code = ?
            `, [access_code])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao contar professores:', err)
            return undefined
        }
    }


    /**
     * Conta o número total de professores aprovados no sistema.
     *
     * - Filtra apenas registros com `approved = true` e `role = 3` (professor).
     *
     * @async
     * @function countAllTeachers
     * @returns {Promise<Object|undefined>} Retorna um objeto com a contagem total, por exemplo:
     * - `{ count: 42 }` se houver professores.
     * Retorna `undefined` se não houver registros ou em caso de erro.
     *
     * @example
     * const totalTeachers = await countAllTeachers();
     * // Resultado:
     * { count: 42 }
     *
     * @example
     * // Nenhum professor encontrado
     * const totalTeachers = await countAllTeachers();
     * // Resultado:
     * undefined
     */
    async countAllTeachers() {
        try {
            const result = await knex.raw(`
                select 
                    count(*)
                from validate_professionals 
                where approved = true and role = 3
            `)
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao contar todos os professores:', err)
            return undefined
        }
    }


    /**
     * Conta o número total de solicitações de validação de professores pendentes (não aprovadas) no sistema.
     *
     * - Filtra apenas registros com `approved = false`.
     *
     * @async
     * @function countAllRequests
     * @returns {Promise<Object|undefined>} Retorna um objeto com a contagem total, por exemplo:
     * - `{ count: 7 }` se houver solicitações pendentes.
     * Retorna `undefined` se não houver registros ou em caso de erro.
     *
     * @example
     * const totalRequests = await countAllRequests();
     * // Resultado:
     * { count: 7 }
     *
     * @example
     * // Nenhuma solicitação pendente encontrada
     * const totalRequests = await countAllRequests();
     * // Resultado:
     * undefined
     */
    async countAllRequests() {
        try {
            const result = await knex.raw(`
                select 
                    count(*)
                from validate_professionals 
                where approved = false
            `)
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao contar todas as solicitações:', err)
            return undefined
        }
    }


    /**
     * Conta o número de solicitações de validação de professores pendentes (não aprovadas)
     * vinculadas a um coordenador específico, filtradas pelo código de acesso (`access_code`).
     *
     * - Filtra apenas registros com `approved = false` e `role = 3` (professor).
     *
     * @async
     * @function countRequests
     * @param {string} access_code - Código de acesso do coordenador para filtrar as solicitações.
     * @returns {Promise<Object|undefined>} Retorna um objeto com a contagem, por exemplo:
     * - `{ count: 3 }` se houver solicitações pendentes.
     * Retorna `undefined` se não houver registros ou em caso de erro.
     *
     * @example
     * const requestsCount = await countRequests("2025ABC");
     * // Resultado:
     * { count: 3 }
     *
     * @example
     * // Nenhuma solicitação pendente encontrada
     * const requestsCount = await countRequests("INVALIDO");
     * // Resultado:
     * undefined
     */
    async countRequests(access_code) {
        try {
            const result = await knex.raw(`
                select 
                    count(*)
                from validate_professionals 
                where approved = false and role = 3 and access_code = ?
            `, [access_code])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao contar requests de professores:', err)
            return undefined
        }
    }


    /**
     * Busca um usuário administrador pelo ID.
     * 
     * @async
     * @function findAdmin
     * @param {string|number} id - ID do usuário a ser buscado.
     * 
     * @returns {Promise<Object|undefined>} Retorna um objeto com os dados do usuário
     *  ({ id, username, email, registration, status }) se encontrado, ou `undefined` caso não exista
     *  ou ocorra algum erro.
     * 
     * @example
     * const admin = await findAdmin(123);
     * if (admin) {
     *   console.log(admin.username);
     * } else {
     *   console.log("Admin não encontrado");
     * }
     */
    async findAdmin(id) {
        try {
            const result = await knex.raw(`
                select 
                    u.id, 
                    u.username,
                    u.email,
                    u.registration,
                    u.status
                from users u
                where u.id = ?
            `, [id]);
            
            const rows = result.rows;

            return rows.length > 0 ? rows[0] : undefined;
        } catch(err) {
            console.error('Erro ao buscar admin por id:', err);
            return undefined;
        }
    }
}

module.exports = new Account()
