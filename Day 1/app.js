// const lodash = require("lodash");

// const numberArray = [15,15,25,72,5,5,8,22];
// console.log("SortBy: "+lodash.sortBy(numberArray));
// console.log(`uniq numbers: ${lodash.uniq(numberArray)}`);
// console.log(`shuffling : ${lodash.shuffle(numberArray)}`);

const express = require("express");
const mongoose = require("mongoose");
const app = express();

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