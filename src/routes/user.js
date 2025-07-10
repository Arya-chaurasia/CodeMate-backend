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

router.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser, status: "accepted" },
                { fromUserId: loggedInUser, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills")
        .populate("toUserId", "firstName lastName photoUrl age gender skills")

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})

    } catch (err) {
        res.status(400).send({ message: "Error: " + err.message })
    }
})

module.exports = router