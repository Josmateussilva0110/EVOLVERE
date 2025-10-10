const express = require("express")
const router = express.Router()
const materialController = require("../controllers/materialController")
const archiveUpload = require("../middleware/Archive")

router.post("/material", (request, response, next) => {
    archiveUpload.single("materials")(request, response, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return response.status(400).json({ status: false, message: "O ficheiro excede 5 MB." })
            }
            return response.status(400).json({ status: false, message: err.message })
        }
        next()
    })
}, materialController.register)



module.exports = router
