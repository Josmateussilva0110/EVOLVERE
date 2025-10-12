const knex = require("../database/connection");

/**
 * Classe para manipulação de dados relacionados a Turmas na base de dados.
 * @class
 */
class Class {

    /**
     * Cria uma nova turma na base de dados.
     */
    async create(data) {
        try {
            // CORREÇÃO: Usando o nome da tabela 'Class'
<<<<<<< HEAD
            const [newClass] = await knex('classes')
=======
            const [newClass] = await knex('Class')
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3
                .insert(data)
                .returning('*');
            return newClass;
        } catch (err) {
            console.error('Erro ao criar turma:', err);
            return undefined;
        }
    }

    /**
     * Busca todas as turmas de uma disciplina específica, incluindo a contagem de alunos.
     */
    async findBySubjectId(subjectId) {
        try {
            // CORREÇÃO: Nomes da tabela e colunas ajustados
<<<<<<< HEAD
            const classes = await knex('classes')
                .select(
                    'classes.id',
                    'classes.name',
                    'classes.period',
                    'classes.capacity',
                    knex.raw('count("classes_alunos".aluno_id) as student_count')
                )
                .leftJoin('classes_alunos', 'classes.id', '=', 'classes_alunos.classes_id')
                .where('classes.subject_id', subjectId)
                .groupBy('classes.id')
                .orderBy('classes.name', 'asc');
=======
            const classes = await knex('Class')
                .select(
                    'Class.id',
                    'Class.name',
                    'Class.period',
                    'Class.capacity',
                    knex.raw('count("Class_alunos".aluno_id) as student_count')
                )
                .leftJoin('Class_alunos', 'Class.id', '=', 'Class_alunos.Class_id')
                .where('Class.subject_id', subjectId)
                .groupBy('Class.id')
                .orderBy('Class.name', 'asc');
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3

            return classes;
        } catch (err) {
            console.error('Erro ao buscar turmas por disciplina:', err);
            return undefined;
        }
    }

    /**
     * ✅ FUNÇÃO ADICIONADA: Busca os detalhes de uma turma e a lista de seus alunos.
     * @param {number} id - O ID da turma.
     * @returns {Promise<Object|undefined>} Um objeto com os detalhes da turma e um array de alunos.
     */
    async getDetails(id) {
        try {
            // CORREÇÃO: Nome da tabela
<<<<<<< HEAD
            const classDetails = await knex('classes')
=======
            const classDetails = await knex('Class')
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3
                .where({ id })
                .first();

            if (!classDetails) {
                return undefined;
            }

            // CORREÇÃO: Nomes da tabela e colunas
            const alunos = await knex('users')
                .select('users.id', 'users.username')
<<<<<<< HEAD
                .join('classes_alunos', 'users.id', '=', 'classes_alunos.aluno_id')
                .where('classes_alunos.classes_id', id);
=======
                .join('Class_alunos', 'users.id', '=', 'Class_alunos.aluno_id')
                .where('Class_alunos.Class_id', id);
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3

            classDetails.alunos = alunos;
            
            return classDetails;
        } catch (err) {
            console.error('Erro ao buscar detalhes da turma:', err);
            return undefined;
        }
    }

    /**
     * ✅ FUNÇÃO ADICIONADA: Remove a associação de um aluno a uma turma.
     * @param {number} turmaId - O ID da turma.
     * @param {number} alunoId - O ID do aluno a ser removido.
     * @returns {Promise<boolean>} Retorna true se a remoção for bem-sucedida.
     */
    async removeStudent(turmaId, alunoId) {
        try {
            // CORREÇÃO: Nomes da tabela e colunas ajustados para corresponder às migrations e aos parâmetros.
<<<<<<< HEAD
            const deleted = await knex('classes_alunos')
=======
            const deleted = await knex('Class_alunos')
>>>>>>> b2415bd1aabded10d1c6c0a52a30697f5237cbe3
                .where({
                    Class_id: turmaId,
                    aluno_id: alunoId
                })
                .delete();
            
            return deleted > 0;
        } catch (err) {
            console.error('Erro ao remover aluno da turma:', err);
            return false;
        }
    }
}

module.exports = new Class();