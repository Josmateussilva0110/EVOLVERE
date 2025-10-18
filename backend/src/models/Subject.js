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


    /**
     * Retorna todos os materiais associados a uma disciplina (subject) no contexto global,
     * ou seja, aqueles vinculados diretamente à disciplina e não a uma turma específica.
     * 
     * A consulta retorna informações combinadas da disciplina, curso e materiais,
     * incluindo o tipo de arquivo (PDF, DOC, PPT) e o período acadêmico derivado
     * da data de atualização da disciplina.
     * 
     * @async
     * @param {number} subject_id - ID da disciplina cujos materiais globais serão buscados.
     * @returns {Promise<Object[]|undefined>} Retorna um array de objetos contendo os materiais encontrados,
     * ou `undefined` caso nenhum material seja encontrado ou ocorra um erro.
     * 
     * @example
     * // Exemplo de uso:
     * const materiais = await Material.getMaterialsGlobal(3);
     * console.log(materiais);
     * 
     * // Estrutura esperada de retorno:
     * [
     *   {
     *     subject_id: 3,
     *     subject_name: "Matemática",
     *     period: "2025.2",
     *     course_id: 2,
     *     course_name: "Licenciatura em Matemática",
     *     type_file: "PDF",
     *     id: 12,
     *     title: "Derivadas - Aula 1",
     *     description: "Material introdutório sobre derivadas",
     *     archive: "materials/1733458291_32.pdf",
     *     created_by: 5,
     *     subject_id: 3,
     *     origin: 1,
     *     updated_at: "2025-10-12T13:22:00.000Z"
     *   }
     * ]
     */
    async getMaterialsGlobal(subject_id) {
        try {
            const result = await knex.raw(`
                select 
                    s.id as subject_id,
                    s.name as subject_name,

                    (
                        EXTRACT(YEAR FROM s.updated_at)::TEXT || '.' ||
                        CASE 
                            WHEN EXTRACT(MONTH FROM s.updated_at) <= 6 THEN '1'
                            ELSE '2'
                        END
                    ) AS period,
                    cv.id as course_id,
                    cv.name as course_name,
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
                    and m.origin = 1
                inner join course_valid cv
                    on cv.id = s.course_valid_id
                where s.id = ?
                order by m.updated_at desc
            `, [subject_id])
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar materiais globais:", err);
            return undefined
        }
    } 


    /**
     * Busca a primeira disciplina (subject) associada a um determinado usuário (profissional).
     * 
     * Esta função consulta a tabela `subjects` para encontrar uma disciplina
     * cujo campo `professional_id` corresponda ao ID informado.
     * Retorna apenas o primeiro resultado encontrado.
     * 
     * @async
     * @param {number} id - ID do profissional (usuário) para o qual se deseja buscar a disciplina.
     * @returns {Promise<Object|null>} Retorna um objeto contendo o `id` da disciplina associada
     * ao usuário, ou `null` caso nenhuma disciplina seja encontrada ou ocorra um erro.
     * 
     * @example
     * // Exemplo de uso:
     * const subject = await Subject.subjectUser(5);
     * console.log(subject);
     * 
     * // Possível retorno:
     * // { id: 12 }
     * 
     * // Caso o usuário não possua disciplina:
     * // null
     */
    async subjectUser(id) {
        try {
            const result = await knex
            .select("id")
            .from("subjects")
            .where({ professional_id: id })
            .first() // pega apenas o primeiro registro

            return result ? result: null
        } catch (err) {
            console.error("Erro ao buscar matéria do usuário:", err)
            return null
        }
    }
    
        /**
     * @summary Busca os detalhes completos de uma disciplina para a tela de gerenciamento.
     * @description Reúne dados da disciplina, seus materiais e suas turmas com contagem de alunos.
     * @param {number} id - O ID da disciplina.
     * @returns {Promise<Object|null>} Um objeto com todos os dados formatados ou null se não for encontrado.
     */
    async findScreenDetailsById(id) {
        try {
            const [subject, materials, classes] = await Promise.all([
                
                // 1. Consulta dos detalhes da disciplina (sem alteração)
                knex('subjects')
                    .join('course_valid', 'subjects.course_valid_id', 'course_valid.id')
                    .where('subjects.id', id)
                    .first(
                        'subjects.*', 
                        'course_valid.name as course_name', 
                        'course_valid.acronym_IES as course_acronym'
                    ),
                
                // 2. Consulta de materiais CORRIGIDA para usar os nomes de coluna corretos
                knex('materials')
                    .where({ subject_id: id })
                    .select(
                        'id',
                        'title as name',        
                        'archive as file_path', 
                        'created_at',
                        'updated_at',
                        knex.raw(`
                            CASE 
                                WHEN type = 1 THEN 'PDF'
                                WHEN type = 2 THEN 'DOCX'
                                WHEN type = 3 THEN 'PPTX'
                                ELSE 'file'
                            END as "fileType"
                        `)
                    )
                    .orderBy('updated_at', 'desc'),

                knex('classes as c')
                    .leftJoin('class_student as cs', 'c.id', 'cs.classes_id') // Verifique o nome da sua tabela pivo
                    .where('c.subject_id', id)
                    .groupBy('c.id', 'c.name', 'c.period')
                    .select('c.id', 'c.name', 'c.period')
                    .count('cs.aluno_id as studentCount')
            ]);

            if (!subject) return null;

            // 4. Formatação final dos dados (NÃO precisa mudar, pois usamos aliases)
            return {
                id: subject.id,
                name: subject.name,
                period: `Período ${subject.period || 'N/A'} • ${subject.course_acronym || 'N/A'}`,
                description: subject.description || 'Nenhuma descrição fornecida.',
                courseId: subject.course_valid_id,
                materials: materials.map(m => ({
                    id: m.id,
                    name: m.name,           // Funciona por causa do alias 'title as name'
                    fileType: m.fileType,
                    uploadDate: m.updated_at,
                    file_path: m.file_path, // Funciona por causa do alias 'archive as file_path'
                })),
                classes: classes.map(c => ({
                    id: c.id,
                    name: c.name,
                    studentCount: parseInt(c.studentCount, 10)
                }))
            };
        } catch (error) {
            console.error("Erro ao buscar detalhes completos da disciplina:", error);
            return undefined;
        }
    }


    /**
     * @summary Verifica se um usuário (coordenador) tem permissão sobre uma disciplina.
     * @description A permissão é validada checando se o ID do coordenador corresponde ao coordenador do curso ao qual a disciplina pertence.
     * @param {number} subjectId - O ID da disciplina.
     * @param {number} coordinatorId - O ID do usuário coordenador.
     * @returns {Promise<boolean>} Retorna `true` se o usuário for o coordenador do curso.
     */
    async isCoordinatorOfSubject(subjectId, coordinatorId) {
        try {
            const subject = await knex('subjects')
                .join('course_valid', 'subjects.course_valid_id', 'course_valid.id')
                .where('subjects.id', subjectId)
                .andWhere('course_valid.coordinator_id', coordinatorId)
                .first('subjects.id');
            return !!subject;
        } catch (error) {
            console.error('Erro ao verificar permissão do coordenador:', error);
            return false;
        }
    }

/**
     * @summary Verifica se um usuário (professor) tem permissão sobre uma disciplina.
     * @description A permissão é validada checando se o ID do professor corresponde ao 'professional_id' da disciplina.
     * @param {number} subjectId - O ID da disciplina.
     * @param {number} teacherId - O ID do usuário professor.
     * @returns {Promise<boolean>} Retorna `true` se o usuário for o professor da disciplina.
     */
    async isTeacherOfSubject(subjectId, teacherId) {
        try {
            const subject = await knex('subjects')
                .where({ id: subjectId, professional_id: teacherId })
                .first('id');
            return !!subject;
        } catch (error) {
            console.error("Erro ao verificar permissão do professor:", error);
            return false;
        }
    }


}

module.exports = new Subject();

