const express = require("express")
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router()

router.get("/user/requests", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills about")

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
        }).populate("fromUserId", "firstName lastName photoUrl age gender skills about")
            .populate("toUserId", "firstName lastName photoUrl age gender skills about")

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({ data })

    } catch (err) {
        res.status(400).send({ message: "Error: " + err.message })
    }
})


router.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }

            ]
        }).select("firstName lastName photoUrl age gender skills")
            .skip(skip)
            .limit(limit)

        res.send({data:user})

    } catch (err) {
        console.log(err, "errrrrrrrrrr")
        res.status(400).json({ message: err.message })
    }
})

module.exports = router