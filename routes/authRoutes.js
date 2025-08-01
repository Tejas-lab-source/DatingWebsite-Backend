const express = require('express');
const authRouter = express.Router();
const { verify } = require('../config/nodemailer');
const {sendVerifyOtp_1st , login , logout, sendVerifyOtp_reset, verifyOtp ,updatePassword, verifyOtp_1st} = require('../controller/authController');
const {tokenCheck} =require("../middleware/tokenCheck")
const userAuth = require('../middleware/userAuth');




authRouter.post('/send-otp-1st' , sendVerifyOtp_1st);
authRouter.post('/verify-otp-1st', verifyOtp_1st); 



authRouter.post('/check', tokenCheck  );
authRouter.post('/login',login);



authRouter.post('/send-verify-otp' , sendVerifyOtp_reset);
authRouter.post('/verify-account',  verifyOtp); 


authRouter.post("/updatePassword",updatePassword )

authRouter.post('/logout',logout);
 // Check if account is verified


module.exports = authRouter;
