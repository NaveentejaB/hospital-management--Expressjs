const Joi = require('joi');

const doctorValidation = {
    addDoctor: (body) => {
        const schema = Joi.object({
            doctor: Joi.object({
                name: Joi.string().min(4).max(100).required(),
                specialization: Joi.string().required(),
                qualification: Joi.string().required(),
                contactNumber: Joi.string().pattern(/^\d{10}$/).required(),
                email: Joi.string().email().required(),
            }).required()
        });
        return schema.validate(body);
    },
    
    updateDoctor: (body) => {
        const schema = Joi.object({
            name: Joi.string().min(4).max(100),
            specialization: Joi.string(),
            qualification: Joi.string(),
            contactNumber: Joi.string().pattern(/^\d{10}$/),
            email: Joi.string().email(),
        }).min(1); // At least one field should be present
        return schema.validate(body);
    }
};

const patientValidation = {
    addPatient: (body) => {
        const schema = Joi.object({
            patient: Joi.object({
                name: Joi.string().min(4).max(100).required(),
                dateOfBirth: Joi.date().required(),
                gender: Joi.string().valid('Male', 'Female', 'Other').required(),
                contactNumber: Joi.string().pattern(/^\d{10}$/).required(),
                address: Joi.string().required(),
            }).required()
        });
        return schema.validate(body);
    },

    updatePatient: (body) => {
        const schema = Joi.object({
            name: Joi.string().min(4).max(100),
            dateOfBirth: Joi.date(),
            gender: Joi.string().valid('Male', 'Female', 'Other'),
            contactNumber: Joi.string().pattern(/^\d{10}$/),
            address: Joi.string(),
        }).min(1); // At least one field should be present
        return schema.validate(body);
    }
};

const mappingValidation = {
    addDoctorToPatient: (body) => {
        const schema = Joi.object({
            patientId:  Joi.string().guid({ version: 'uuidv4' }).required(),
            doctorId: Joi.string().guid({ version: 'uuidv4' }).required(),
            assignDate: Joi.date().iso().default(new Date())
        });
        return schema.validate(body);
    }
};


const userValidation = {
    register: (body) => {
        const schema = Joi.object({
            user: Joi.object({
                name: Joi.string().min(4).max(100).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
                    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                    .message('Password must contain at least one uppercase letter, one lowercase letter, and one number')
            }).required()
        });
        return schema.validate(body);
    },

    login: (body) => {
        const schema = Joi.object({
            user: Joi.object({
                email: Joi.string().email(),
                name: Joi.string().min(4),
                password: Joi.string().required()
            }).required()
            .xor('email', 'name') // Either email or name must be present, but not both
        });
        return schema.validate(body);
    }
};

// Param Validations (for ID parameters)
const paramValidation = {
    // For single UUID validation (used in doctor and patient routes)
    id: (params) => {
        const schema = Joi.object({
            id: Joi.string().guid({ version: 'uuidv4' }).required()
                .messages({
                    'string.guid': 'Invalid ID format. Must be a valid UUID',
                    'any.required': 'ID is required'
                })
        });
        return schema.validate(params);
    },
    
    // For patient UUID validation in mapping routes
    patientId: (params) => {
        const schema = Joi.object({
            patientId: Joi.string().guid({ version: 'uuidv4' }).required()
                .messages({
                    'string.guid': 'Invalid patient ID format. Must be a valid UUID',
                    'any.required': 'Patient ID is required'
                })
        });
        return schema.validate(params);
    },

    // For doctor-patient mapping route
    doctorPatientIds: (params) => {
        const schema = Joi.object({
            doctorId: Joi.string().guid({ version: 'uuidv4' }).required()
                .messages({
                    'string.guid': 'Invalid doctor ID format. Must be a valid UUID',
                    'any.required': 'Doctor ID is required'
                }),
            patientId: Joi.string().guid({ version: 'uuidv4' }).required()
                .messages({
                    'string.guid': 'Invalid patient ID format. Must be a valid UUID',
                    'any.required': 'Patient ID is required'
                })
        });
        return schema.validate(params);
    }
};


module.exports = {
    doctorValidation,
    patientValidation,
    mappingValidation,
    userValidation,
    paramValidation
};