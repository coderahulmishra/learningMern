const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./router/auth_router");
const MONGO_URI = "mongodb+srv://coderahulmishra:YYpRp6iZ1smjiWNU@cluster0.7s3lw.mongodb.net/firstDatabase"

app.use(express.json());
app.use("/auth/api",authRouter)
// app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("Database Connected")
})
.catch((err) => {
    console.log("Error to connecting database")
})

app.listen(3000,(req,res) => {
    console.log("Server running");
})