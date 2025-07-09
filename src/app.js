const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")


app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)



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
