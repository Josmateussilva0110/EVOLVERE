const Course = require("../models/Course")


class courseController {

    async getCourses(request, response) {
        const courses = await Course.getAll()
        if(!courses) {
            return response.status(404).json({status: false, message: 'Nenhum curso encontrado.'})
        }
        return response.status(200).json({status: true, courses})
    }

}

module.exports = new courseController()

