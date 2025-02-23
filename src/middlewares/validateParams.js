const {paramValidation} = require("../utils/validation")

const validateParams = {
    validateId: (req, res, next) => {
        const { error } = paramValidation.id(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    },

    validatePatientId: (req, res, next) => {
        const { error } = paramValidation.patientId(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    },

    validateDoctorPatientIds: (req, res, next) => {
        const { error } = paramValidation.doctorPatientIds(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    }
};

module.exports = validateParams;