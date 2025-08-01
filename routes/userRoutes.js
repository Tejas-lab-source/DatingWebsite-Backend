const express = require('express');
const userAuth = require('../middleware/userAuth');
const { getUserById } = require('../controller/userController');

const userRouter = express.Router();

userRouter.get('/:id',userAuth ,getUserById);
userRouter.put('/:id',userAuth ,getUserById);
userRouter.delete('/:id',userAuth ,getUserById);
userRouter.get('/suggestions',userAuth ,getUserById);
userRouter.post('/upload-photo',userAuth ,getUserById);
userRouter.get('/:id',userAuth ,getUserById);

module.exports=userRouter 