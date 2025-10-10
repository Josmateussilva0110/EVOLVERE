const knex = require("../database/connection");

/**
 * Classe para manipulação de disciplinas (subjects) na base de dados.
 * @class
 */
class Subject {

    /**
     * Busca todas as disciplinas cadastradas com informações do professor e curso.
     * @async
     * @returns {Promise<Object[]|undefined>} Retorna um array de disciplinas ou `undefined` se não houver resultados.
     * @example
     * const subjects = await Subject.getAll();
     * // Retorno:
     * // [
     * //   { id: 1, name: "Cálculo I", professor_nome: "Ana Silva", curso_nome: "Engenharia Civil" },
     * //   { id: 2, name: "Algoritmos", professor_nome: "Carlos Lima", curso_nome: "Ciência da Computação" }
     * // ]
     */
    async getAll() {
        try {
            const result = await knex
                .select(
                    'subjects.id',
                    'subjects.name',
                    'users.username as professor_nome',
                    'course_valid.name as curso_nome'
                )
                .from('subjects')
                .leftJoin('users', 'subjects.professional_id', 'users.id')
                .leftJoin('course_valid', 'subjects.course_valid_id', 'course_valid.id');
            
            return result.length > 0 ? result : undefined;
        } catch(err) {
            console.error('Erro ao buscar todas as disciplinas:', err);
            return undefined;
        }
    }

    /**
     * Busca uma disciplina específica pelo seu ID com detalhes completos.
     * @async
     * @param {number} id - ID da disciplina.
     * @returns {Promise<Object|undefined>} Retorna o objeto da disciplina ou `undefined` se não for encontrada.
     * @example
     * const subject = await Subject.getById(1);
     * // Retorno:
     * // {
     * //   id: 1,
     * //   name: "Cálculo I",
     * //   professor_nome: "Ana Silva",
     * //   professor_email: "ana.silva@email.com",
     * //   curso_nome: "Engenharia Civil",
     * //   curso_sigla: "UFPI"
     * // }
     */
    async getById(id) {
        try {
            const result = await knex
                .select(
                    'subjects.*',
                    'users.username as professor_nome',
                    'users.email as professor_email',
                    'course_valid.name as curso_nome',
                    'course_valid.acronym_IES as curso_sigla'
                )
                .from('subjects')
                .leftJoin('users', 'subjects.professional_id', 'users.id')
                .leftJoin('course_valid', 'subjects.course_valid_id', 'course_valid.id')
                .where('subjects.id', id);
            
            return result[0] || undefined;
        } catch(err) {
            console.error('Erro ao buscar disciplina por ID:', err);
            return undefined;
        }
    }

    /**
     * Cria uma nova disciplina na base de dados.
     * @async
     * @param {Object} data - Dados da nova disciplina.
     * @param {string} data.name - Nome da disciplina.
     * @param {number} data.professional_id - ID do professor responsável.
     * @param {number} data.course_valid_id - ID do curso associado.
     * @returns {Promise<Object|undefined>} Retorna o objeto da disciplina recém-criada.
     * @example
     * const newSubject = await Subject.create({
     * name: "Álgebra Linear",
     * professional_id: 5,
     * course_valid_id: 2
     * });
     * // Retorno: { id: 3, name: "Álgebra Linear", ... }
     */
    async create(data) {
        try {
            const [novaDisciplina] = await knex('subjects')
                .insert({
                    name: data.name,
                    professional_id: data.professional_id,
                    course_valid_id: data.course_valid_id,
                })
                .returning('*');

            return novaDisciplina;
        } catch(err) {
            console.error('Erro ao criar disciplina:', err);
            return undefined;
        }
    }

    /**
     * Atualiza os dados de uma disciplina existente.
     * @async
     * @param {number} id - ID da disciplina a ser atualizada.
     * @param {Object} data - Campos a serem atualizados.
     * @returns {Promise<Object|undefined>} Retorna o objeto da disciplina atualizada.
     * @example
     * const updatedSubject = await Subject.update(3, { name: "Álgebra Linear Avançada" });
     * // Retorno: { id: 3, name: "Álgebra Linear Avançada", ... }
     */
    async update(id, data) {
        try {
            const updated = await knex('subjects')
                .where({ id })
                .update({
                    ...data,
                    updated_at: new Date()
                });
                
            if (updated === 0) return undefined; // Nenhuma linha afetada
            
            return await this.getById(id);
        } catch(err) {
            console.error('Erro ao atualizar disciplina:', err);
            return undefined;
        }
    }

    /**
     * Apaga uma disciplina da base de dados.
     * @async
     * @param {number} id - ID da disciplina a ser apagada.
     * @returns {Promise<boolean>} Retorna `true` se a exclusão for bem-sucedida, `false` caso contrário.
     * @example
     * const success = await Subject.delete(3);
     * // Retorno: true
     */
    async delete(id) {
        try {
            const deleted = await knex('subjects')
                .where({ id })
                .delete();
                
            return deleted > 0;
        } catch(err) {
            console.error('Erro ao apagar disciplina:', err);
            return false;
        }
    }

    /**
     * Busca todas as disciplinas lecionadas por um professor específico.
     * @async
     * @param {number} professionalId - ID do professor.
     * @returns {Promise<Object[]|undefined>} Lista de disciplinas do professor.
     * @example
     * const subjects = await Subject.getByProfessor(5);
     * // Retorno: [ { id: 1, name: "Cálculo I", ano_periodo: "2025.2", ... } ]
     */
    async getByProfessor(professionalId) {
        try {
            const result = await knex.raw(`
                SELECT 
                    s.*, 
                    c.name AS course_name,
                    c."acronym_IES" AS course_sigla,
                    (
                        EXTRACT(YEAR FROM s.updated_at)::TEXT || '.' ||
                        CASE 
                            WHEN EXTRACT(MONTH FROM s.updated_at) <= 6 THEN '1'
                            ELSE '2'
                        END
                    ) AS period,
                    CASE 
                        WHEN s.professional_id IS NOT NULL THEN 1 
                        ELSE 0 
                    END AS status
                FROM subjects s
                LEFT JOIN course_valid c ON s.course_valid_id = c.id
                WHERE s.professional_id = ?;
            `, [professionalId]);

            const rows = result.rows;
            return rows.length > 0 ? rows : undefined;
        } catch (err) {
            console.error('Erro ao buscar disciplinas por professor:', err);
            return undefined;
        }
    }




    /**
     * Busca todas as disciplinas de um curso específico.
     * @async
     * @param {number} courseId - ID do curso.
     * @returns {Promise<Object[]|undefined>} Lista de disciplinas do curso.
     * @example
     * const subjects = await Subject.getByCourse(2);
     * // Retorno: [ { id: 2, name: "Algoritmos", ... }, { id: 5, name: "Estrutura de Dados", ... } ]
     */
    async getByCourse(courseId) {
        try {
            const result = await knex
                .select(
                    'subjects.*',
                    'users.username as professor_nome',
                    'users.email as professor_email'
                )
                .from('subjects')
                .leftJoin('users', 'subjects.professional_id', 'users.id')
                .where('subjects.course_valid_id', courseId);
                
            return result.length > 0 ? result : undefined;
        } catch(err) {
            console.error('Erro ao buscar disciplinas por curso:', err);
            return undefined;
        }
    }

    /**
     * Conta o número total de disciplinas no sistema.
     * @async
     * @returns {Promise<number>} O número total de disciplinas.
     * @example
     * const count = await Subject.countAllSubjects();
     * // Retorno: 42
     */
    async countAllSubjects() {
        try {
            const result = await knex.raw(`
                select 
                    count(*)
                from subjects 
            `)
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao contar todas as disciplinas:', err)
            return undefined
        }
    }

    /**
     * Conta o número de disciplinas associadas a um curso específico.
     * @async
     * @param {string} access_code - Código de acesso do curso.
     * @returns {Promise<number>} O número de disciplinas do curso.
     * @example
     * const count = await Subject.countSubjects("CS101");
     * // Retorno: 8
     */
    async countSubjects(access_code) {
        try {
            const result = await knex.raw(`
                select 
                    count(*)
                from subjects 
                inner join course_valid cv
                    on cv.id = course_valid_id
                where cv.course_code = ?
            `, [access_code])
            const rows = result.rows
            return rows.length > 0 ? rows[0] : undefined
        } catch(err) {
            console.error('Erro ao contar as disciplinas', err)
            return undefined
        }
    }

    /**
     * Encontra professores disponíveis para lecionar num curso específico.
     * A lógica encontra professores aprovados para o curso, independentemente de já lecionarem.
     * @async
     * @param {number} courseId - ID do curso.
     * @returns {Promise<Object[]>} Uma lista de professores disponíveis.
     */
    async findProfessors(courseId) {
        try {
            const professors = await knex('users')
                .select('users.id', 'users.username', 'vp.institution')
                .join('validate_professionals as vp', 'users.id', '=', 'vp.professional_id')
                .join('course_valid as cv', 'vp.access_code', '=', knex.raw('cv.course_code::text'))
                .where('cv.id', courseId)
                .where('vp.role', 3) // Garante que são professores
                .where('vp.approved', true);
            
            return professors;
        } catch (err) {
            console.error("Erro ao buscar professores por curso:", err);
            return [];
        }
    }

    async getMaterialsGlobal(subject_id) {
        try {
            const result = await knex.raw(`
                select 
                    s.id as subject_id,
                    s.name as subject_name,
                    case 
                        when m.type = 1 then 'PDF'
                        when m.type = 2 then 'DOC'
                        when m.type = 3 then 'PPT'
                        else 'Desconhecido'
                    end as type_file,
                    m.*
                from subjects s
                left join materials m
                    on m.subject_id  = s.id
                where s.id = ?
            `, [subject_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar materiais globais:", err);
            return undefined
        }
    } 
}

module.exports = new Subject();

