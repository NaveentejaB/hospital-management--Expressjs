const express = require("express");
const PatientController = require("../controllers/PatientController");
const {authenticate} = require("../middlewares/auth");
const validateParams = require("../middlewares/validateParams")


const router = express.Router();
const patientController = new PatientController();

router.post("/",authenticate,(req,res) => {
    return patientController.addNewPatient(req,res);
});
router.get("/",(req,res) => {
    return patientController.getAllPatients(req,res);
});
router.get("/:id",validateParams.validateId,(req,res) => {
    return patientController.getPatientById(req,res);
});
router.put("/:id",validateParams.validateId,(req,res) => {
    return patientController.updatePatient(req,res);
});
router.delete("/:id",validateParams.validateId,(req,res) => {
    return patientController.deletePatient(req,res);
});


module.exports = router