const express = require('express');
const { createConfession, getAllConfessions,toggleLike, editConfession, deleteConfession} = require('../controller/confessionController')
const confessionsRouter = express.Router();
const userAuth = require('../middleware/userAuth')
confessionsRouter.post('/createConfession', createConfession);
confessionsRouter.get('/getAllConfessions', getAllConfessions);
confessionsRouter.post('/toggleLike', userAuth,toggleLike);
confessionsRouter.post('/editConfession', userAuth,editConfession);
confessionsRouter.post('/deleteConfession', userAuth,deleteConfession);
module.exports = confessionsRouter;
