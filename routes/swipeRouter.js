const express = require('express');
const swipeRouter = express.Router();
const { swipeUserRight, swipeUserLeft } = require('../controller/swipeController');
const userAuth = require('../middleware/userAuth')
// 🟢 Call the specific functions
swipeRouter.post('/right',userAuth, swipeUserRight);   // For right swipe
swipeRouter.post('/left',userAuth, swipeUserLeft);     // For left swipe

module.exports = swipeRouter; 
