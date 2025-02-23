const Patient = require("../models/Patient");
const {patientValidation} = require("../utils/validation.js")

class PatientController{
    async addNewPatient(req,res){
        const { error } = patientValidation.addPatient(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const {patient} = req.body;
        const newPatient = await Patient.create(patient);
        
        return res.status(201).json({
            data : newPatient,
            success : true,
            message : 'new patient added'
        });
    }

    async getAllPatients(req,res){
        const patients = await Patient.findAll();
        return res.status(200).json({
            data : patients,
            success : true,
            message : 'patients data retrived'
        });
    }

    async getPatientById(req,res){
        const {id} = req.params;
        const patient = await Patient.findByPk(id);
        if(!patient)
            return res.status(400).json({
                success : false,
                message : 'patient not found'
            });
        
        return res.status(200).json({
            data : patient,
            success : true,
            message : 'patient data retrived'
        });
    }

    async updatePatient(req,res){
        const { id } = req.params;
        const { error } = patientValidation.updatePatient(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        await patient.update(req.body);
        
        const updatedPatient = await Patient.findByPk(id);
        
        return res.status(200).json({
            data: updatedPatient,
            success: true,
            message: 'Patient updated successfully'
        });
    }

    async deletePatient(req,res){
        const {id} = req.params;
        const patient = await Patient.findByPk(id);

        if(!patient)
            return res.status(400).json({
                success : false,
                message : 'patient not found'
            });

        await patient.destroy();

        return res.status(200).json({
            data : patient,
            success : true,
            message : 'patient data deleted.'
        });
    }
}

module.exports = PatientController;