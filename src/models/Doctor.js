const { v4: uuidv4, validate } = require('uuid');
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/database')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Doctor = sequelize.define("Doctor", {
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
    age : {
        type : Sequelize.DataTypes.NUMBER,
        validate :{
            min : 0, max : 130
        },
        allowNull : false
    },
    gender :{
        type: Sequelize.DataTypes.STRING,  
        allowNull: false,
        validate: {
            isIn: [['Male', 'Female', 'Other']]  // Validate the values
        },
        defaultValue: 'Male'
    },
    specialization : {
        type:Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    qualification : {
        type:Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    contactNumber:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
            isEmail: true
        }
    }
},{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
})

module.exports = Doctor;