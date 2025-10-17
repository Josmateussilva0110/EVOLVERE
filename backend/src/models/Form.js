const knex = require("../database/connection")

class Form {

    async formExists(title, class_id) {
        try {
            const result = await knex("form")
            .select("id")
            .where({ title, class_id })
            .first()

            return !!result 
        } catch (err) {
            console.error("Erro ao verificar título:", err)
            return false
        }
    }

    async save(data) {
        try {
            const [result] = await knex("form")
            .insert(data)
            .returning("id") 
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar formulário:", err)
            return { success: false }
        }
    }


    async saveQuestion(data) {
        try {
            const [result] = await knex("questions")
            .insert(data)
            .returning("id") 
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar questões:", err)
            return { success: false }
        }
    }


    async saveOption(data) {
        try {
            const [result] = await knex("options")
            .insert(data)
            .returning("id") 
            return { success: true, insertId: result.id }
        } catch (err) {
            console.error("Erro ao cadastrar opções:", err)
            return { success: false }
        }
    }

    async getFormByUser(created_by) {
        try {
            const result = await knex.raw(`
                
                select
                    f.id,
                    f.title,
                    f.description,
                    f.subject_id,
                    f.class_id,
                    f.updated_at,
                    json_agg(
                    json_build_object(
                        'id', q.id,
                        'text', q.text,
                        'type', q.type,
                        'options', (
                        SELECT json_agg(
                            json_build_object(
                            'id', o.id,
                            'text', o.text,
                            'correct', o.correct
                            )
                        )
                        FROM options o
                        WHERE o.question_id = q.id
                        )
                    )
                    ) AS questions
                from form f
                inner join questions q ON q.form_id = f.id
                where f.created_by = ?
                group by f.id
                order by f.updated_at DESC;
                `, [created_by]);
            const rows = result.rows
            return rows.length > 0 ? rows : undefined
        } catch(err) {
            console.error("Erro ao buscar formulários:", err);
            return undefined
        }
    }

    async formExist(id) {
        try {
            const result = await knex.select("*").where({id}).table("form")
            return result.length > 0
        } catch(err) {
            console.error('Erro ao verificar formulário:', err)
            return false
        }
    }

    async deleteById(id) {
        try {
            const deleted = await knex('form').where({ id }).delete();
            return deleted > 0;
        } catch (err) {
            console.error("Erro ao deletar formulário:", err);
            return false;
        }
    }


    
}

module.exports = new Form()
