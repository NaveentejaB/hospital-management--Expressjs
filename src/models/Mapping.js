const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/database')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const PatientDoctorMapping  = sequelize.define("PatientDoctorMapping", {
    // primary key
    id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    patientId :{
        type:Sequelize.DataTypes.UUID,
        allowNull: false,
    },
    doctorId :{
        type:Sequelize.DataTypes.UUID,
        allowNull: false
    },
    assignDate:{
        type:Sequelize.DataTypes.DATE,
        allowNull: false,
    }
},{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
})

module.exports = PatientDoctorMapping ;