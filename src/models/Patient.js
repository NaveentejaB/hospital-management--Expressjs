const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/database')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Patient = sequelize.define("Patient", {
    // primary key
    id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    name:{
        type:Sequelize.DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    dateOfBirth:{
        type:Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    gender :{
        type: Sequelize.DataTypes.STRING,  
        allowNull: false,
        validate: {
            isIn: [['Male', 'Female', 'Other']]  // Validate the values
        },
        defaultValue: 'Male'
    },
    contactNumber:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    address :{
        type:Sequelize.DataTypes.TEXT,
        allowNull: false,
    }
},{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
})

module.exports = Patient;