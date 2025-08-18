const express = require("express");
const connectDB = require("./config/database");
require('dotenv').config();
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")
const cors = require("cors");
//const paymentRouter = require("./routes/payment");
const http = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
require("./utils/cronJobs")

app.use(cors(
    {
        origin: [
            "http://localhost:3000",                         // local dev
            "https://code-mate-frontend-five.vercel.app",
            "http://localhost:5173"
        ],
        credentials: true
    }
))
app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
//app.use("/", paymentRouter)
app.use("/", chatRouter);

const server = http.createServer(app)
initializeSocket(server)



connectDB()
    .then(() => {
        console.log("Db connection established")
        const PORT = process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log("server is successfully running")
        })
    })
    .catch((err) => {
        console.log(err, "Error")
    })
