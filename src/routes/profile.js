const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const router = express.Router();

router.get("/profile", userAuth, async (req, res) => {
    console.log("ROUTE HIT");
    console.log("USER FROM TOKEN:", req.user);

    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        console.error(err, "err in profile")
        res.status(400).send("Error" + err.message)
    }
})


router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save()
        res.send({ message: `${loggedInUser.firstName}, your profile has been updated succesfully`, data: loggedInUser })
    } catch (error) {
        console.error(error, "err in editing")
        res.status(400).send("Error : " + error.message)
    }
})

module.exports = router;