const express = require('express');
const fs = require("fs");
const { upload } = require("../middleware/multer.middleware");
const { cloudinary, uploadOnCloudinary } = require("../utils/cloudinary");
const messageRouter = express.Router();
const {rightSideBar ,getMessages,  sendMessage,conversationUser ,createMessage} = require('../controller/messageController');

const userAuth =require('../middleware/userAuth')
messageRouter.get("/leftsidebar",userAuth ,conversationUser);
messageRouter.post("/create",userAuth ,createMessage);
messageRouter.get("/rightsidebar/:userId", userAuth,rightSideBar )
messageRouter.get("/:receiverId" , userAuth,getMessages);

messageRouter.post("/send/:receiverId", upload.single("file") ,sendMessage);

module.exports = messageRouter;