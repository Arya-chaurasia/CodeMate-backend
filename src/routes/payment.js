const express = require("express");
const { userAuth } = require("../middleware/auth");
const paymentRouter = express.Router();

paymentRouter.post("/create", userAuth, async(req, res) => {

})


module.exports = paymentRouter