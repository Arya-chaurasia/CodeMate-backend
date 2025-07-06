const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)

        const { firstName, lastName, emailId, password } = req.body

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User successfully registed")
    } catch (error) {
        console.log(error)
        res.status(400).send("Something went wrong", error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@123")
            res.cookie("token", token)
            console.log(user, "user")
            res.send("Login Successful")
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (err) { 
        console.log("Error in login" + err)
    }

})

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
