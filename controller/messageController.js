const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user');
const Message = require('../models/message'); // ✅ CORRECT
const { userSocketMap, getIo } = require('../socketManger');




const rightSideBar = async (req, res) => {
    const currentUserId = req.headers['userid'];
    const otherUserId = req.params.userId;
    try {

        const user = await User.findById(otherUserId).select("name , profile , bio")
        if (!user) return res.status(404).json({ message: "User not found" })

        const mediaMessages = await Message.find({

            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
            image: { $ne: null }
        }).sort({ createdAt: -1 })

        const images = mediaMessages.map(msg => msg.image)

        return res.status(200).json({
            user, images
        })

    } catch (err) {
        console.error("Error fetching user media: ", err);
        return res.status(500).json({ message: "Internal server error" })
    }


}

const getMessages = async (req, res) => {
    const userId = req.headers['userid'];
    const receiverId = req.params.receiverId

    try {
        const messages = await Message.find({

            $or: [

                { senderId: userId, receiverId:receiverId },
                { senderId: receiverId, receiverId: userId }
            ],
        }).sort({ createdAt: 1 });
          console.log("working");
          
        res.status(200).json({ messages })
    } catch (error) {
        console.error("Error fetching messages: ", err);
        res.status(500).json({ message: "internal server error" })
    }


}





const sendMessage = async (req, res) => {
    try {
        
        
        const senderId = req.headers['userid'];
        const receiverId = req.params.receiverId;
        const { text } = req.body;

        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || null,
            image: req.file?.path || null,
        });

        await newMessage.save();
const io = getIo(); // safely access io instance
const receiverSocketId = userSocketMap[receiverId];
        // Emit to receiver if they are online
     
        if (receiverSocketId) {
            Socket.to(receiverSocketId).emit("newMessage", {
                _id: newMessage._id,
                senderId,
                receiverId,
                text: newMessage.text,
                image: newMessage.image,
                createdAt: newMessage.createdAt
            });
        }

        res.status(201).json({ message: newMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};






const conversationUser = async (req, res) => {
    try {
       

        const UserID = req.headers['userid'];

        if (!UserID || !mongoose.Types.ObjectId.isValid(UserID)) {
            return res.status(400).json({ message: "Invalid or missing UserID in headers" });
        }

        const userObjectId = new ObjectId(UserID);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const messages = await Message.find({
            $or: [
                { senderId: userObjectId },
                { receiverId: userObjectId }
            ]
        }).sort({ updatedAt: -1 });


        const uniqueUserIds = new Set();

        for (let msg of messages) {
            let partnerId;
            if (msg.senderId.toString() === UserID) {
                partnerId = msg.receiverId;
            } else {
                partnerId = msg.senderId;
            }
            uniqueUserIds.add(partnerId.toString());
        }

        const userIdsArray = Array.from(uniqueUserIds);
        const paginatedUserIds = userIdsArray.slice(skip, skip + limit);


        const chatList = await User.find({
            _id: { $in: paginatedUserIds }
        }).select("_id name profile bio");


        res.status(200).json({ chatList });

    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text, image } = req.body;

    // Validate required fields
    if (!senderId || !receiverId ||(!text && !image)) {
      return res.status(400).json({ message: "Sender and receiver IDs are required." });
    }

    // Create message object
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: image || "",
    });

    // Save message to DB
    const savedMessage = await newMessage.save();

    return res.status(201).json({
      message: "Message sent successfully.",
      data: savedMessage,
    });

  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
    rightSideBar, getMessages, sendMessage,  conversationUser,createMessage
}