const express = require("express");

const { Chat } = require("../models/chat");
const { userAuth } = require("../middleware/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
});

chatRouter.get("/chats", userAuth, async (req, res) => {
  const userId = req.user._id;

  try {
    let chats = await Chat.find({ participants: userId })
      .populate({
        path: "participants",
        select: "firstName lastName photoUrl",
      })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      })
      .sort({ updatedAt: -1 }); // latest chat first

    // format response like WhatsApp
    chats = chats.map(chat => {
      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1]
          : null;

      // Exclude the logged-in user from participants
      const otherParticipants = chat.participants.filter(
        p => p._id.toString() !== userId.toString()
      );

      return {
        _id: chat._id,
        participants: otherParticipants, // 👈 only others
        lastMessage,
        updatedAt: chat.updatedAt,
      };
    });

    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = chatRouter;