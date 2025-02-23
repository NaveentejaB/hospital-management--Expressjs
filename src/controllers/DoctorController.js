const Doctor = require("../models/Doctor.js");
const { doctorValidation} = require('../utils/validation.js');
const {Op} = require("sequelize")

class DoctorController{
    async addDoctor(req,res){
        const { error } = doctorValidation.addDoctor(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const {doctor} = req.body;
        const checkDoctor = await Doctor.findOne({
            where : {
                [Op.or] : [
                    {name : doctor.name},
                    {email : doctor.email}
                ]
            }
        })

        if(checkDoctor)
            return res.status(400).json({
                success : false,
                message : 'doctor with given name/email already exists'
            });

        const newDoctor = await Doctor.create(doctor);

        return res.status(201).json({
            data : newDoctor,
            success : true,
            message : 'new doctor added'
        });
    }

    async getAllDoctors(req,res){
        const doctors = await Doctor.findAll();
        return res.status(200).json({
            data : doctors,
            success : true,
            message : 'Doctors data retrived'
        });
    }

    async getDoctorById(req,res){
        const {id} = req.params;
        const doctor = await Doctor.findByPk(id);
        if(!doctor)
            return res.status(404).json({
                success : false,
                message : 'Doctor not found'
            });   
        return res.status(200).json({
            data : doctor,
            success : true,
            message : 'Doctor data retrived'
        });
    }

    async updateDoctor(req,res){
        const { id } = req.params;
        const { error } = doctorValidation.updateDoctor(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        await doctor.update(req.body);
        
        const updatedDoctor = await Doctor.findByPk(id);
        
        return res.status(200).json({
            data: updatedDoctor,
            success: true,
            message: 'Doctor updated successfully'
        });
    }

    async deleteDoctor(req,res){
        const {id} = req.params;
        const doctor = await Doctor.findByPk(id);
        if(!doctor)
            return res.status(404).json({
                success : false,
                message : 'Doctor not found'
            });
        await doctor.destroy();

        return res.status(200).json({
            data : doctor,
            success : true,
            message : 'Doctor data deleted'
        });
    }
}

module.exports = DoctorController;