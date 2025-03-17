const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/auth_model");
const SECRET_KEY = "tokenKey"


const home = async (req,res) => {
    try {
        res.status(200).send("Home page using controllers");
    } catch (error) {
        console.log("Error");
    }
}

const submit = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.send("user already exist");
        }
        const hashpassword = await bcrypt.hash(password,10);
        const newUser = new User({name,email,password:hashpassword});
        await newUser.save();
        res.send("User created");
    } catch (error) {
        console.log("Submit Error");
    }
}

const login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.send("user not exist");
        }
        const matchPassword = await bcrypt.compare(password,user.password);
        if(!matchPassword){
            res.send("Password is incorrect");
        }
        const token = jwt.sign({userId:user.id},SECRET_KEY,{expiresIn:"1h"})
        res.json({message: "You are successfully login",token})
    } catch (error) {
        res.status(500).send("Error in login")
    }
}

const users = async (req,res) => {
    try {
        const users = await User.find();
        res.send(users)
    } catch (error) {
        console.log("Error in finding user");
    }
}

const updateUser = async (req,res) => {
    try {
        const {name,email} = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{name,email},{new:true});
        if(!updatedUser){
            res.send("User not found");
        }
        res.json(updatedUser)
    } catch (error) {
        console.log("Error in updating user");
    }
}

const deleteUser = async (req,res) => {
    try {
        const deleteUser = User.findByIdAndDelete(req.params.id);

        if(!deleteUser){
            res.status(404).send("User not found");
        }
        res.send("User delete successfully");
    } catch (error) {
        console.log("Error in deleting user");
    }
}
module.exports = {home, submit, users, updateUser, deleteUser, login}