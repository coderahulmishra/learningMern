// const lodash = require("lodash");

// const numberArray = [15,15,25,72,5,5,8,22];
// console.log("SortBy: "+lodash.sortBy(numberArray));
// console.log(`uniq numbers: ${lodash.uniq(numberArray)}`);
// console.log(`shuffling : ${lodash.shuffle(numberArray)}`);

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();

const SECRET_KEY = "mySecretKey"

const User = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/firstDatabase",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("DB Connection Error:", err));

app.get("/",(req,res) => {
    res.send("Hello, this is my first Express server!");
})

app.post("/submit",async (req,res) => {
    try {
        const {name,email} = req.body;
        const newUser = new User({name,email});
        await newUser.save();
        res.send("Data Saved Successfully!");
    } catch (error) {
        res.status(500).send("Error saving data");
    }
})

app.get("/users", async(req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error featching data");
    }
})

app.put("/users/:id",async (req,res) => {
    try {
        const {name,email} = req.body;
        const userUpdated = await User.findByIdAndUpdate(req.params.id,{name,email},{new: true});
        if(!userUpdated){
            return res.status(404).send("User not found");
        }
        res.json(userUpdated);
    } catch (error) {
        res.status(500).send("Error Updating User")
    }
})

app.delete("/users/:id", async (req,res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if(!deleteUser){
            return res.status(404).send("user not found");
        }
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Error Deleting User")
    }
})

app.get("/about",(req,res) => {
    res.send("This is about page using express");
})

app.get("/contact",(req,res) => {
    res.send("This is contact us page using express");
})

app.listen(3000,() => {
    console.log(`server running on: http://localhost:3000`);
})

//Signup Route
app.post("/signup",async (req,res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).send("Email already registered");
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //save user
        const newUser = new User({name,email,password:hashedPassword});
        await newUser.save();

        res.send("User registered successfully!");
    } catch (error) {
        res.status(500).send("Error signing up");
    }
})

//login route
app.post("/login", async(req,res) => {
    try {
        const {email,password} = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send("User not found");
        }

        //Compare password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).send("Invalid password");
        }

        //Generate JWT Token
        const token = jwt.sign({userId: user._id},SECRET_KEY,{expiresIn:"1h"});

        res.json({message: "Login successful",token});
    } catch (error) {
        res.status(500).send("Error logging in");
    }
})