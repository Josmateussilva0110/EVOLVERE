const express = require("express")
const router = express.Router()
const formController = require("../controllers/FormController")

router.get("/form/relations/:id", formController.getRelations)
router.post("/form/publish", formController.publish)
router.get("/form/:id", formController.findFormByUser)
router.get("/form/view/:id", formController.view)
router.delete("/form/:id", formController.delete)




module.exports = router
