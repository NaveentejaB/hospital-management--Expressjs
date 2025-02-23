const express = require("express");
const DoctorController = require("../controllers/DoctorController");
const {authenticate} = require("../middlewares/auth");
const validateParams = require("../middlewares/validateParams")


const router = express.Router();
const doctorController = new DoctorController();

router.post("/",authenticate,(req,res) => {
    return doctorController.addDoctor(req,res);
});
router.get("/",(req,res) => {
    return doctorController.getAllDoctors(req,res);
});
router.get("/:id",validateParams.validateId,(req,res) => {
    return doctorController.getDoctorById(req,res);
});
router.put("/:id",validateParams.validateId,(req,res) => {
    return doctorController.updateDoctor(req,res);
});
router.delete("/:id",validateParams.validateId,(req,res) => {
    return doctorController.deleteDoctor(req,res);
});


module.exports = router