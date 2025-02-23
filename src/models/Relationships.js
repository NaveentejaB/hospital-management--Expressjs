const User = require('./User');
const Doctor = require('./Doctor');
const Patient = require("./Patient");
const PatientDoctorMapping = require('./Mapping');

const initializeRelationships = (sequelize) => {
    // Add hooks to both Doctor and Patient models
    Doctor.addHook('beforeDestroy', async (doctor, options) => {
        await PatientDoctorMapping.destroy({
            where: { doctorId: doctor.id },
            transaction: options.transaction
        });
    });

    Patient.addHook('beforeDestroy', async (patient, options) => {
        await PatientDoctorMapping.destroy({
            where: { patientId: patient.id },
            transaction: options.transaction
        });
    });

    // Patient to PatientDoctorMapping relationship
    Patient.hasMany(PatientDoctorMapping, {
        foreignKey: 'patientId',
        as: 'doctorMappings'
    });
    PatientDoctorMapping.belongsTo(Patient, {
        foreignKey: 'patientId',
        as: 'patient'
    });

    // Doctor to PatientDoctorMapping relationship
    Doctor.hasMany(PatientDoctorMapping, {
        foreignKey: 'doctorId',
        as: 'patientMappings'
    });
    PatientDoctorMapping.belongsTo(Doctor, {
        foreignKey: 'doctorId',
        as: 'doctor'
    });

    // Convenience methods for direct Patient-Doctor relationship
    Patient.belongsToMany(Doctor, {
        through: PatientDoctorMapping,
        foreignKey: 'patientId',
        otherKey: 'doctorId',
        as: 'doctors'
    });
    Doctor.belongsToMany(Patient, {
        through: PatientDoctorMapping,
        foreignKey: 'doctorId',
        otherKey: 'patientId',
        as: 'patients'
    });
};

module.exports = initializeRelationships;