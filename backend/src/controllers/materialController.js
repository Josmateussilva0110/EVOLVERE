const MaterialFieldValidator = require("../utils/materialValidator")
const Material = require("../models/Material")
const Class = require("../models/Class")
const path = require("path")
const fs = require("fs")
const validator = require('validator');


/**
 * @class MaterialController
 * @classdesc Controlador responsável pelas operações relacionadas aos materiais,
 * incluindo cadastro, validação e exclusão de arquivos associados a disciplinas ou turmas.
 */
class MaterialController {

    /**
   * Registra um novo material no sistema, salvando o arquivo no servidor e
   * armazenando seus metadados no banco de dados.
   *
   * - Caso o `class_id` seja informado, o material será associado a uma turma (`origin = 2`).
   * - Caso contrário, será associado à disciplina (`origin = 1`).
   *
   * @async
   * @param {import("express").Request} request - Objeto da requisição HTTP, contendo dados e o arquivo enviado.
   * @param {import("express").Response} response - Objeto da resposta HTTP.
   * @returns {Promise<import("express").Response>} Retorna um JSON com o status da operação.
   *
   * @example
   * // Exemplo de uso:
   * POST /materials
   * Body: {
   *   "title": "Aula 1 - Introdução",
   *   "description": "Apresentação inicial da disciplina",
   *   "type": 1,
   *   "created_by": 3,
   *   "subject_id": 10
   * }
   */
    async register(request, response) {
        try {
            const {title, description, type, created_by, subject_id, class_id} = request.body
            const error = MaterialFieldValidator.validate({ title, description, type, created_by, subject_id })
            if (error) return response.status(422).json({ status: false, message: error })
            
            if(class_id) {
                if (!validator.isInt(class_id + '', { min: 1 })) {
                    return res.status(422).json({ success: false, message: "ID da turma invalido." });
                }
            }

            if (!request.file) {
                return response.status(400).json({ status: false, message: "O upload de um arquivo é obrigatório." })
            }

            const rootDir = path.join(__dirname, "..", "..")
            const uploadDir = path.join(rootDir, "public", "materials")
            fs.mkdirSync(uploadDir, { recursive: true })


            const uniqueName = Date.now() + "_" + Math.floor(Math.random() * 100) + path.extname(request.file.originalname)
            const finalPath = path.join(uploadDir, uniqueName)
            const archivePath = path.join("materials", uniqueName)

            fs.writeFileSync(finalPath, request.file.buffer)

            const data = {
                title, 
                description, 
                type, 
                archive: archivePath, 
                created_by, 
                subject_id
            }
            if(class_id) {
                data.class_id = class_id
                data.origin = 2
            }
            const valid = await Material.save(data)
            if(!valid) {
                return response.status(500).json({status: false, message: "Erro ao cadastrar material"})
            }
            return response.status(200).json({status: true, message: "Material Cadastrado com sucesso", subject_id})
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
   * Exclui um material existente do banco de dados e, opcionalmente, do servidor.
   *
   * @async
   * @param {import("express").Request} request - Objeto da requisição HTTP contendo o parâmetro `id` do material.
   * @param {import("express").Response} response - Objeto da resposta HTTP.
   * @returns {Promise<import("express").Response>} Retorna um JSON com o status da exclusão.
   *
   * @example
   * // Exemplo de uso:
   * DELETE /materials/12
   */
    async delete(request, response) {
        try {
            const { id } = request.params
            if (!validator.isInt(id + '', { min: 1 })) {
                return res.status(422).json({ success: false, message: "ID inválido." });
            }
            const materialExist = await Material.materialExist(id)
            if(!materialExist) {
                return response.status(404).json({ status: false, message: "Material não encontrado." })
            }
            const valid = await Material.deleteById(id) 
            if(!valid) {
                return response.status(500).json({ status: false, message: "Erro ao deletar material." })
            }
            return response.status(200).json({ status: true, message: "Material deletado com sucesso." })
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }


    /**
     * Obtém todos os materiais associados a uma turma específica.
     *
     * Essa função é responsável por validar o `class_id` recebido via parâmetros,
     * verificar se a turma existe no banco de dados e, caso exista, retornar todos
     * os materiais relacionados a ela. Caso a turma não exista ou não possua materiais,
     * respostas adequadas são enviadas com os códigos HTTP correspondentes.
     *
     * @async
     * @function getMaterialsClass
     * @param {import('express').Request} request - Objeto de requisição do Express, contendo os parâmetros da rota.
     * @param {import('express').Response} response - Objeto de resposta do Express, usado para retornar o resultado da operação.
     * @returns {Promise<import('express').Response>} Retorna uma resposta JSON com o status da operação e os dados ou mensagem de erro.
     *
     * @example
     * // Exemplo de rota Express usando o controlador:
     * router.get('/materials/:class_id', MaterialController.getMaterialsClass);
     *
     * // Requisição:
     * GET /materials/12
     *
     * // Resposta de sucesso (200):
     * {
     *   "status": true,
     *   "materials": [
     *     { "id": 1, "title": "Introdução ao JavaScript", "url": "https://..." },
     *     { "id": 2, "title": "Banco de Dados Relacional", "url": "https://..." }
     *   ]
     * }
     *
     * // Resposta de erro (422): Campo inválido
     * { "status": false, "message": "class_id é obrigatório." }
     *
     * // Resposta de erro (404): Turma não encontrada
     * { "status": false, "message": "Turma não encontrada." }
     *
     * // Resposta de erro (404): Nenhum material encontrado
     * { "status": false, "message": "Nenhum material encontrado." }
     *
     * // Resposta de erro (500): Erro interno
     * { "status": false, "message": "Erro interno no servidor." }
     */
    async getMaterialsClass(request, response) {
        try {
            const { class_id } = request.params
            const error = MaterialFieldValidator.validate({class_id})
            if (error) return response.status(422).json({ status: false, message: error })
            const classExist = await Class.classExist(class_id)
            if(!classExist) {
                return response.status(404).json({status: false, message: "Turma não encontrada."})
            }
            
            const materials = await Material.getMaterialsByIdClass(class_id)
            console.log(materials)
            if(!materials) {
                return response.status(404).json({status: false, message: "Nenhum material encontrado."})
            }

            return response.status(200).json({ status: true, ...materials })
            
            
        } catch(err) {
            return response.status(500).json({ status: false, message: "Erro interno no servidor." })
        }
    }

}

module.exports = new MaterialController()
