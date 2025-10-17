const express = require("express")
const router = express.Router()
const formController = require("../controllers/FormController")

router.get("/form/relations/:id", formController.getRelations)
router.post("/form/publish", formController.publish)




module.exports = router
