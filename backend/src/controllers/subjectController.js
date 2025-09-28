const Subject = require('../models/Subject')

const subjectController = {
  /**
   * Lista todas as disciplinas
   */
  async list(req, res) {
    try {
      const subjects = await Subject.getAll()
      
      if (!subjects) {
        return res.status(404).json({ 
          status: false, 
          message: 'Nenhuma disciplina encontrada' 
        })
      }
      
      res.status(200).json({ 
        status: true, 
        subjects 
      })
    } catch (error) {
      console.error('Erro ao listar disciplinas:', error)
      res.status(500).json({ 
        status: false, 
        message: 'Erro interno do servidor' 
      })
    }
  },

  /**
   * Cria uma nova disciplina
   */
  async create(req, res) {
    try {
      const { name, professional_id, course_valid_id } = req.body
      
      // Validações básicas
      if (!name || !professional_id || !course_valid_id) {
        return res.status(400).json({ 
          status: false, 
          message: 'Todos os campos são obrigatórios' 
        })
      }
      
      const subject = await Subject.create({
        name,
        professional_id: parseInt(professional_id),
        course_valid_id: parseInt(course_valid_id)
      })
      
      if (!subject) {
        return res.status(400).json({ 
          status: false, 
          message: 'Erro ao criar disciplina' 
        })
      }
      
      res.status(201).json({ 
        status: true, 
        message: 'Disciplina criada com sucesso',
        data: subject 
      })
    } catch (error) {
      console.error('Erro ao criar disciplina:', error)
      res.status(500).json({ 
        status: false, 
        message: 'Erro interno do servidor' 
      })
    }
  },

  /**
   * Obtém disciplina por ID
   */
  async getById(req, res) {
    try {
      const subject = await Subject.getById(parseInt(req.params.id))
      
      if (!subject) {
        return res.status(404).json({ 
          status: false, 
          message: 'Disciplina não encontrada' 
        })
      }
      
      res.json({ 
        status: true, 
        data: subject 
      })
    } catch (error) {
      console.error('Erro ao buscar disciplina:', error)
      res.status(500).json({ 
        status: false, 
        message: 'Erro interno do servidor' 
      })
    }
  },

  /**
   * Atualiza disciplina
   */
  async update(req, res) {
    try {
      const subject = await Subject.update(parseInt(req.params.id), req.body)
      
      if (!subject) {
        return res.status(404).json({ 
          status: false, 
          message: 'Disciplina não encontrada' 
        })
      }
      
      res.json({ 
        status: true, 
        message: 'Disciplina atualizada com sucesso',
        data: subject 
      })
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error)
      res.status(500).json({ 
        status: false, 
        message: 'Erro interno do servidor' 
      })
    }
  },

  /**
   * Exclui disciplina
   */
  async delete(req, res) {
    try {
      const deleted = await Subject.delete(parseInt(req.params.id))
      
      if (!deleted) {
        return res.status(404).json({ 
          status: false, 
          message: 'Disciplina não encontrada' 
        })
      }
      
      res.status(200).json({status: true, message: "Disciplina excluída com sucesso."})
    } catch (error) {
      console.error('Erro ao excluir disciplina:', error)
      res.status(500).json({ 
        status: false, 
        message: 'Erro interno do servidor' 
      })
    }
  }
}

module.exports = subjectController
