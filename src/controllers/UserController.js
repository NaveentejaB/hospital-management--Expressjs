const User = require("../models/User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const {userValidation} = require("../utils/validation.js")


class UserController{

    async registerUser(req,res){
        const { error } = userValidation.register(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const {user} = req.body;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        const newUser = await User.create(user);
        delete newUser.password;
        res.status(201).json({
            data : newUser,
            message : 'User created successfully',
            success : false
        });
    }

    async logInUser(req,res){
        const { error } = userValidation.login(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { user } = req.body;

        if (!user || (!user.email && !user.name) || !user.password) {
            return res.status(400).json({
                message: "Email/Name and Password are required",
                success: false
            });
        }

        const condition = user.email ? { email: user.email } : { name: user.name };
        const userData = await User.findOne({ where: { [Op.and]: [condition] } });

        if (!userData) {
            return res.status(401).json({
                message: "Invalid email or name",
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(user.password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email/name or password",
                success: false
            });
        }

        const payload = {
            id: userData.id,
            email: userData.email,
            name: userData.name
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '12h'
        });

        res.status(200).json({
            data: userData,
            accessToken: accessToken,
            message: 'User logged in successfully',
            success: true
        });
    }


    async deleteUser(req,res){
        const id = req.params.id;
        const deletedUser = await User.findByPk(id);
        await deletedUser.destroy();

        res.status(200).json({
            data : deletedUser,
            message : 'User deleted successfully',
            success : true
        });
    }
}

module.exports = UserController;