const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, id) => {
  return crypto
    .createHash("sha256")
    .update([userId, id].sort().join("$"))
    .digest("hex");
};


const initializeSocket = (server) => {
const io = socket(server, {
    cors: {
        origin: [
          "http://localhost:5173",
          "https://code-mate-frontend-five.vercel.app"  
        ],
        credentials: true
    },
    path: "/socket.io" 
});


    io.on("connection", (socket)=> {

        socket.on("joinchat", ({firstName, userId, id}) => {
            const roomId = getSecretRoomId(userId, id)
            console.log("Joining room by " + firstName + " " + roomId)
            socket.join(roomId)

        })

        socket.on("sendMessage", async ({
            firstName ,
             lastName,
            userId,
            id,
            text
        }) => {
             const roomId = getSecretRoomId(userId, id)
             console.log(firstName + " " + text)

                let chat = await Chat.findOne({
            participants: { $all: [userId, id] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, id],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

            io.to(roomId).emit("messageReceived", {firstName,lastName, text})
            
        })

        socket.on("disconnect", () => {
            
        })
    })
}


module.exports = initializeSocket