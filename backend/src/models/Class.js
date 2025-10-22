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


    /**
     * Busca o ID da turma associada a uma determinada disciplina.
     * 
     * @async
     * @function getIdClassBySubject
     * @param {number} subject_id - ID da disciplina.
     * @returns {Promise<Object|null>} Retorna um objeto contendo o ID da turma encontrada, 
     * ou `null` caso não exista nenhuma turma associada.
     * 
     * @throws {Error} Registra no console caso ocorra erro na consulta.
     * 
     * @example
     * const classData = await getIdClassBySubject(12);
     * if (classData) console.log(classData.id);
     */
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


    /**
     * Busca todos os alunos matriculados em uma turma específica.
     * 
     * @async
     * @function Students
     * @param {number} class_id - ID da turma.
     * @returns {Promise<Array<Object>|undefined>} Retorna uma lista de alunos com os campos:
     * - `student_id`: ID do aluno
     * - `username`: nome de usuário do aluno
     * 
     * Retorna `undefined` se não houver alunos cadastrados.
     * 
     * @throws {Error} Registra no console caso ocorra falha na consulta SQL.
     * 
     * @example
     * const students = await Students(5);
     * if (students) console.log(students.length, "alunos encontrados");
     */
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


    /**
     * Verifica se um aluno está matriculado em uma turma específica.
     * 
     * @async
     * @function studentExist
     * @param {number} id - ID do aluno.
     * @param {number} class_id - ID da turma.
     * @returns {Promise<boolean>} Retorna `true` se o aluno estiver matriculado, caso contrário `false`.
     * 
     * @throws {Error} Registra no console caso ocorra erro na verificação.
     * 
     * @example
     * const exists = await studentExist(3, 7);
     * if (exists) console.log("Aluno já está na turma.");
     */
    async studentExist(id, class_id) {
        try {
            const result = await knex.select("*").where({ student_id: id, class_id}).table("class_student")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar aluno:', err)
            return false
        }
    }


    /**
     * Remove a matrícula de um aluno em uma turma específica.
     * 
     * @async
     * @function deleteStudentById
     * @param {number} student_id - ID do aluno a ser removido.
     * @param {number} class_id - ID da turma da qual o aluno será removido.
     * @returns {Promise<boolean>} Retorna `true` se a exclusão for bem-sucedida, caso contrário `false`.
     * 
     * @throws {Error} Registra no console caso ocorra falha ao deletar o registro.
     * 
     * @example
     * const deleted = await deleteStudentById(5, 10);
     * if (deleted) console.log("Aluno removido com sucesso.");
     */
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


    /**
     * Retorna todas as turmas em que um aluno está matriculado, 
     * junto com informações adicionais da turma e do professor responsável.
     * 
     * @async
     * @function getClassByIdUser
     * @param {number} student_id - ID do aluno.
     * @returns {Promise<Array<Object>|undefined|false>} 
     * - Retorna uma lista de turmas com:
     *   - `student_id`: ID do aluno
     *   - `class_id`: ID da turma
     *   - `class_name`: nome da turma
     *   - `teacher_name`: nome do professor
     * - Retorna `undefined` se o aluno não estiver em nenhuma turma.
     * - Retorna `false` em caso de erro.
     * 
     * @throws {Error} Registra no console caso ocorra falha na consulta.
     * 
     * @example
     * const classes = await getClassByIdUser(12);
     * if (classes) console.log(classes.map(c => c.class_name));
     */
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


    /**
     * Verifica se uma turma existe pelo seu ID.
     * 
     * @async
     * @function classExist
     * @param {number} id - ID da turma a ser verificada.
     * @returns {Promise<boolean>} Retorna `true` se a turma existir, caso contrário `false`.
     * 
     * @throws {Error} Registra no console caso ocorra erro na verificação.
     * 
     * @example
     * const exists = await classExist(8);
     * if (!exists) console.log("Turma não encontrada.");
     */
    async classExist(id) {
        try {
            const result = await knex.select("*").where({id}).table("classes")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar material:', err)
            return false
        }
    }
}

module.exports = new Class();
