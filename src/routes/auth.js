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

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.json({ message: "User successfully registed", data: savedUser })
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
            const token = await user.getJWT();
            res.cookie("token", token, {
                httpOnly: true,       // prevents JS access
                secure: true,         // required for HTTPS on Render
                sameSite: "None",     // allows cross-site cookies
                expires: new Date(Date.now() + 8 * 3600000)
            })

            console.log(user, "user")
            res.send(user)
        } else {
            throw new Error("Invalid credentials password")
        }
    } catch (err) {
        console.log("Error in login" + err)
        res.status(401).send(err.message);
    }

})


router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successful")

})


module.exports = router;