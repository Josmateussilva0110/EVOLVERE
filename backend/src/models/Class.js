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
            const [newClass] = await knex('classes')
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
            const classes = await knex('classes')
                .select(
                    'classes.id',
                    'classes.name',
                    'classes.period',
                    'classes.capacity',
                    knex.raw('count("class_student".student_id) as student_count')
                )
                .leftJoin('class_student', 'classes.id', '=', 'class_student.class_id')
                .where('classes.subject_id', subjectId)
                .groupBy('classes.id')
                .orderBy(knex.raw('LOWER(classes.name)'), 'asc')

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
            const classDetails = await knex('classes')
                .where({ id })
                .first();

            if (!classDetails) {
                return undefined;
            }

            // CORREÇÃO: Nomes da tabela e colunas
            const alunos = await knex('users')
                .select('users.id', 'users.username')
                .join('class_student', 'users.id', '=', 'class_student.student_id')
                .where('class_student.class_id', id);

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
            const deleted = await knex('classes_alunos')
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

    async findIdSubject(id) {
        try {
            const result = await knex.select(["subject_id"]).where({id}).table("classes")
            if(result.length > 0) {
                return result[0]
            }
            else {
                return undefined
            }
        } catch (err) {
            console.error("Erro ao buscar id da disciplina:", err)
            return undefined
        }
    }

    async getMaterialsClass(class_id) {
        try {
            const result = await knex.raw(`
                select 
                    c.id,
                    c.subject_id,
                    c.name as class_name,
                    cv.id as course_id,
                    cv.name as course_name,
                    case 
                        when m.type = 1 then 'PDF'
                        when m.type = 2 then 'DOC'
                        when m.type = 3 then 'PPT'
                        else 'Desconhecido'
                    end as type_file,
                    m.*
                from classes c
                left join materials m
                    on m.class_id  = c.id
                inner join course_valid cv
                    on cv.id = c.course_id
                where c.id = ?
                order by m.updated_at desc
            `, [class_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar materiais da turma: ", err);
            return undefined
        }
    } 
}

module.exports = new Class();
