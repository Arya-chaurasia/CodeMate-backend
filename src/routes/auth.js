const express = require("express")
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const router = express.Router();


router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credentials - email")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@123")
            res.cookie("token", token)

            console.log(user, "user")
            res.send(user)
        } else {
            throw new Error("Invalid credentials password")
        }
    } catch (err) {
        console.log("Error in login" + err)
    }

})


router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
res.send("Logout Successful")

})


module.exports = router;