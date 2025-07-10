const express = require("express")
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router()

router.get("/user/requests", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills")

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        })

    } catch (err) {
        req.statusCode(400).send("Error : " + err.message)
    }
})

module.exports = router