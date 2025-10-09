const validator = require('validator')
const Subject = require("../models/Subject")

/**
 * Classe responsável por gerenciar as ações dos professores.
 * 
 * @class
 */
class TeacherController {

    
    /**
     * Obtém todas as disciplinas associadas a um determinado professor.
     * 
     * @async
     * @function getAllSubjects
     * @memberof TeacherController
     * 
     * @param {import('express').Request} request - Objeto de requisição do Express.
     * @param {import('express').Response} response - Objeto de resposta do Express.
     * 
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON contendo:
     *  - `status`: booleano indicando sucesso ou falha.  
     *  - `subjects`: lista de disciplinas, se encontradas.  
     *  - `message`: mensagem de erro, se aplicável.
     * 
     * @example
     * // Exemplo de rota usando o método getAllSubjects
     * const express = require("express")
     * const router = express.Router()
     * const TeacherController = require("../controllers/TeacherController")
     * 
     * // Rota: GET /teachers/:id/subjects
     * router.get("/teachers/:id/subjects", TeacherController.getAllSubjects)
     * 
     * // Requisição de exemplo:
     * // GET /teachers/5/subjects
     * //
     * // Resposta de sucesso (HTTP 200):
     * // {
     * //   "status": true,
     * //   "subjects": [
     * //     { "id": 1, "nome": "Matemática", "codigo": "MAT101" },
     * //     { "id": 2, "nome": "Física", "codigo": "FIS202" }
     * //   ]
     * // }
     * //
     * // Resposta de erro (HTTP 404):
     * // {
     * //   "status": false,
     * //   "message": "Nenhuma disciplina encontrada."
     * // }
     */
    async getAllSubjects(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return response.status(422).json({status: false, message: "Id inválido."})
            }
            const subjects = await Subject.getByProfessor(id)
            if(!subjects) {
                return response.status(404).json({status: false, message: "Nenhuma disciplina encontrada."})
            }
            return response.status(200).json({status: true, subjects})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }
}

module.exports = new TeacherController()
