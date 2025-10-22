const knex = require("../database/connection");

/**
 * Classe para manipulação de dados relacionados a Turmas na base de dados.
 * @class
 */
class Class {

    /**
     * @summary Cria uma nova turma na base de dados.
     * @param {Object} data - Dados da turma a ser criada.
     * @param {string} data.name - Nome da turma.
     * @param {string} data.period - Período da turma.
     * @param {number} data.subject_id - ID da disciplina.
     * @param {number} data.course_id - ID do curso.
     * @param {number} data.capacity - Capacidade máxima de alunos.
     * @returns {Promise<Object|undefined>} Objeto da turma criada ou undefined em caso de erro.
     * @example
     * // Uso:
     * const newClass = await Class.create({
     *   name: "Turma A",
     *   period: "2025.1",
     *   subject_id: 1,
     *   course_id: 2,
     *   capacity: 40
     * });
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
     * @summary Busca todas as turmas de uma disciplina específica, incluindo a contagem de alunos.
     * @param {number} subjectId - ID da disciplina.
     * @returns {Promise<Array|undefined>} Array de turmas com contagem de alunos ou undefined em caso de erro.
     * @example
     * // Uso:
     * const classes = await Class.findBySubjectId(1);
     * // Retorno:
     * // [
     * //   { id: 1, name: "A", period: "2025.1", capacity: 40, student_count: "35" },
     * //   { id: 2, name: "B", period: "2025.1", capacity: 35, student_count: "30" }
     * // ]
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
     * @summary Busca os detalhes de uma turma e a lista de seus alunos.
     * @param {number} id - O ID da turma.
     * @returns {Promise<Object|undefined>} Um objeto com os detalhes da turma e um array de alunos.
     * @example
     * // Uso:
     * const classDetails = await Class.getDetails(1);
     * // Retorno:
     * // {
     * //   id: 1,
     * //   name: "Turma A",
     * //   period: "2025.1",
     * //   subject_id: 1,
     * //   course_id: 2,
     * //   capacity: 40,
     * //   alunos: [
     * //     { id: 10, username: "João Silva" },
     * //     { id: 15, username: "Maria Oliveira" }
     * //   ]
     * // }
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
     * @summary Busca o ID da disciplina associada a uma turma.
     * @param {number} id - ID da turma.
     * @returns {Promise<Object|undefined>} Objeto contendo o subject_id ou undefined se não encontrado.
     * @example
     * // Uso:
     * const result = await Class.findIdSubject(1);
     * // Retorno: { subject_id: 5 }
     */
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

    /**
     * @summary Busca todos os materiais associados a uma turma específica.
     * @param {number} class_id - ID da turma.
     * @returns {Promise<Array|undefined>} Array de materiais da turma ou undefined se não encontrados.
     * @example
     * // Uso:
     * const materials = await Class.getMaterialsClass(1);
     * // Retorno:
     * // [
     * //   {
     * //     id: 1,
     * //     subject_id: 5,
     * //     class_name: "Turma A",
     * //     course_id: 2,
     * //     course_name: "Engenharia",
     * //     type_file: "PDF",
     * //     name: "Apostila 1",
     * //     file_path: "/materials/apostila1.pdf"
     * //   }
     * // ]
     */
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
                    and m.origin = 2
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

    async getIdClassBySubject(subject_id) {
        try {
            const result = await knex
            .select("id")
            .from("classes")
            .where({ subject_id })
            .first() 

            return result ? result: null
        } catch (err) {
            console.error("Erro ao buscar id da classe:", err)
            return null
        }
    }

    async Students(class_id) {
        try {
            const result = await knex.raw(`
                select 
                    cs.student_id,
                    u.username
                from class_student cs
                inner join users u 
                    on u.id = cs.student_id
                where cs.class_id = ?
            `, [class_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar alunos da turma: ", err);
            return undefined
        }
    } 

    async studentExist(id, class_id) {
        try {
            const result = await knex.select("*").where({ student_id: id, class_id}).table("class_student")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar aluno:', err)
            return false
        }
    }

    async deleteStudentById(student_id, class_id) {
        try {
            const deleted = await knex('class_student')
            .where({ student_id, class_id })
            .del()

            return deleted > 0
        } catch (err) {
            console.error("Erro ao deletar aluno:", err)
            return false
        }
    }


    async getClassByIdUser(student_id) {
        try {
            const result = await knex.raw(`
                select 
                    cs.student_id,
                    cs.class_id,
                    c.name as class_name,
                    u.username as teacher_name
                from class_student cs
                inner join classes c
                    on c.id = cs.class_id
                inner join subjects s
                    on s.id = c.subject_id
                inner join users u 
                    on u.id = s.professional_id
                where cs.student_id = ?
            `, [student_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar turmas do aluno:", err);
            return false;
        }
    }
}

module.exports = new Class();
