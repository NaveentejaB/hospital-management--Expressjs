const PatientDoctorMapping = require("../models/Mapping");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const {mappingValidation} = require("../utils/validation.js")

class MappingController {
    async addDoctorToPatient(req, res) {
        const { error } = mappingValidation.addDoctorToPatient(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { patientId, doctorId, assignDate } = req.body;
        
        const [patient, doctor] = await Promise.all([
            Patient.findByPk(patientId),
            Doctor.findByPk(doctorId)
        ]);

        if (!patient || !doctor) {
            return res.status(404).json({
                message: 'Patient or Doctor not found',
                success: false
            });
        }

        const existingMapping = await PatientDoctorMapping.findOne({
            where: { patientId, doctorId }
        });

        if (existingMapping) {
            return res.status(400).json({
                message: 'This doctor is already assigned to the patient',
                success: false
            });
        }

        const assignPerson = await PatientDoctorMapping.create({
            patientId,
            doctorId,
            assignDate: assignDate || new Date()
        });
        const assignedData = await PatientDoctorMapping.findByPk(assignPerson.id,{
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                }
            ],
            attributes : {
                exclude : ['patientId','doctorId','createdAt','updatedAt']
            }
        });

        return res.status(201).json({
            data: assignedData,
            message: 'Doctor assigned to patient successfully',
            success: true
        });
    }

    async retriveAllDoctorPatientPairs(req, res) {
        const data = await PatientDoctorMapping.findAll({
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                },
                {
                    model: Doctor,
                    as: 'doctor',
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                }
            ],
            order: [['patientId', 'ASC']],
            attributes : {
                exclude : ['patientId','doctorId','createdAt','updatedAt']
            }
        });
        return res.status(200).json({
            data : data,
            message: 'Doctor and patient pairs fetched successfully',
            success: true
        });
    }

    async getAllDoctorsAssignedToPatient(req, res) {
        const { patientId } = req.params;
        
        const patient = await Patient.findByPk(patientId, {
            include: [{
                model: Doctor,
                as: 'doctors',
                through: { attributes: ['assignDate'] },
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }]
        });

        if (!patient) {
            return res.status(404).json({
                message: 'Patient not found',
                success: false
            });
        }

        return res.status(200).json({
            data: patient.doctors,
            message: 'Doctors assigned to patient fetched successfully',
            success: true
        });
    }

    async deleteDoctorFromPatient(req, res) {
        const { doctorId, patientId } = req.params;

        const mapping = await PatientDoctorMapping.findOne({
            where: { doctorId, patientId }
        });

        if (!mapping) {
            return res.status(404).json({
                message: 'Doctor-Patient mapping not found',
                success: false
            });
        }

        await mapping.destroy();

        res.status(200).json({
            message: 'Doctor-Patient mapping removed successfully',
            success: true
        });
    }
}

module.exports = MappingController;