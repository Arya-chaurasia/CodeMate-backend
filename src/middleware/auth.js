const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log("TOKEN:", token);
        if(!token) {
            return res.status(401).send("Please loginx")
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder@123")

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        console.log(user, "user details in middleware")

        if (!user) {
            throw new Error("user not found")
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("JWT Error:", error.message)
        res.status(400).send("Error")
    }

}

module.exports = {
    userAuth
}