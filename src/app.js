const express = require("express");
const connectDB = require("./config/database")
const app = express();

connectDB()
    .then(() => {
        console.log("Db connection established")
        app.listen(3000, () => {
            console.log("server is successfully running")
        })
    })
    .catch((err) => {
        console.log("Error")
    })
