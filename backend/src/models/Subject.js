const knex = require("../database/connection")

/**
 * Classe para manipulação de disciplinas (subjects) na base de dados.
 * @class
 */
class Subject {

    /**
     * Busca todas as disciplinas cadastradas com informações dos relacionamentos.
     *
     * @async
     * @returns {Promise<Object[]|undefined>} Retorna um array de disciplinas com dados do professor e curso,
     * ou `undefined` se nenhuma disciplina for encontrada ou se ocorrer erro.
     *
     * @example
     * const subjects = await Subject.getAll()
     * // subjects = [
     * //   { 
     * //     id: 1, 
     * //     name: "Matemática", 
     * //     professional_id: 1,
     * //     course_valid_id: 1,
     * //     created_at: "2024-01-01...",
     * //     updated_at: "2024-01-01...",
     * //     professor: { id: 1, username: "João Silva", email: "joao@email.com" },
     * //     curso: { id: 1, name: "Engenharia", acronym_IES: "UFMG" }
     * //   }
     * // ] ou undefined
     */
    async getAll() {
        try {
            const result = await knex
                .select(
                    'subjects.id',
                    'subjects.name',
                    'users.username as professor_nome', // Junta o nome do professor
                    'course_valid.name as curso_nome' // Junta o nome do curso
                )
                .from('subjects')
                .leftJoin('users', 'subjects.professional_id', 'users.id')
                .leftJoin('course_valid', 'subjects.course_valid_id', 'course_valid.id');
            
            return result.length > 0 ? result : undefined
        } catch(err) {
            console.error('Erro ao buscar disciplinas:', err)
            return undefined
        }
    }

    /**
     * Busca uma disciplina pelo ID.
     *
     * @async
     * @param {number} id - ID da disciplina.
     * @returns {Promise<Object|undefined>} Retorna a disciplina encontrada ou `undefined`
     * caso não exista ou se ocorrer erro.
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
                .where('subjects.id', id)
                
            return result[0] || undefined
        } catch(err) {
            console.error('Erro ao buscar disciplina por ID:', err)
            return undefined
        }
    }

    /**
     * Cria uma nova disciplina.
     *
     * @async
     * @param {Object} data - Dados da disciplina.
     * @returns {Promise<Object|undefined>} Retorna a disciplina criada ou `undefined` em caso de erro.
     */
    async create(data) {
        try {
            // ✅ CORREÇÃO: Usamos .returning('*') para pegar o objeto inteiro de volta.
            // O resultado é um array com um único item: o novo objeto da disciplina.
            const [novaDisciplina] = await knex('subjects')
                .insert({
                    name: data.name,
                    professional_id: data.professional_id,
                    course_valid_id: data.course_valid_id,
                    // created_at e updated_at são gerenciados pelo DB com timestamps(true, true)
                })
                .returning('*'); // <--- AQUI ESTÁ A MÁGICA!

            // Agora não precisamos de uma segunda busca, já temos o objeto completo.
            return novaDisciplina;

        } catch(err) {
            console.error('Erro ao criar disciplina:', err);
            return undefined;
        }
    }

    /**
     * Atualiza uma disciplina existente.
     * (Seu código original aqui já estava bom)
     */
    async update(id, data) {
        try {
            const updated = await knex('subjects')
                .where({ id })
                .update({
                    ...data,
                    updated_at: new Date()
                });
                
            if (updated === 0) return undefined;
            
            return await this.getById(id);
        } catch(err) {
            console.error('Erro ao atualizar disciplina:', err);
            return undefined;
        }
    }

    /**
     * Exclui uma disciplina.
     * (Seu código original aqui já estava bom)
     */
    async delete(id) {
        try {
            const deleted = await knex('subjects')
                .where({ id })
                .delete();
                
            return deleted > 0;
        } catch(err) {
            console.error('Erro ao excluir disciplina:', err);
            return false;
        }
    }

    /**
     * Busca disciplinas por professor.
     * (Seu código original aqui já estava bom)
     */
    async getByProfessor(professionalId) {
        try {
            const result = await knex
                .select(
                    'subjects.*',
                    'course_valid.name as curso_nome',
                    'course_valid.acronym_IES as curso_sigla'
                )
                .from('subjects')
                .leftJoin('course_valid', 'subjects.course_valid_id', 'course_valid.id')
                .where('subjects.professional_id', professionalId);
                
            return result.length > 0 ? result : undefined;
        } catch(err) {
            console.error('Erro ao buscar disciplinas por professor:', err);
            return undefined;
        }
    }

    /**
     * Busca disciplinas por curso.
     * (Seu código original aqui já estava bom)
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

    
}

module.exports = new Subject()