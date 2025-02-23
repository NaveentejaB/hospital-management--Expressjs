const express = require("express");
const MappingController = require("../controllers/MappingController");
const validateParams = require("../middlewares/validateParams");


const router = express.Router();
const mappingController = new MappingController();

router.get("/",(req,res) => {
    return mappingController.retriveAllDoctorPatientPairs(req,res);
});
router.post("/",(req,res) => {
    return mappingController.addDoctorToPatient(req,res);
});
router.get("/:patientId",validateParams.validatePatientId,(req,res) => {
    return mappingController.getAllDoctorsAssignedToPatient(req,res);
});
router.delete("/:patientId/:doctorId",validateParams.validateDoctorPatientIds,(req,res) => {
    return mappingController.deleteDoctorFromPatient(req,res);
});


module.exports = router;