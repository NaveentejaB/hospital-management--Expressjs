const express = require("express");
const userController = require("../controllers/UserController");


const router = express.Router();
const UserController = new userController();


router.post('/register',(req,res) => {
    return UserController.registerUser(req,res);
});
router.post('/login',(req,res) => {
    return UserController.logInUser(req,res);
});


module.exports = router