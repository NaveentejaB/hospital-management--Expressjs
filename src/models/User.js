const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/database')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const User = sequelize.define("User", {
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
    email:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    }
},{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
})

module.exports = User;