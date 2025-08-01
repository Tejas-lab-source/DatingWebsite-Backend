const express = require('express')
const profileRouter = express.Router()
const {createProfile ,editProfile, getMyProfile ,getProfileUser, getProfiles, deleteProfiles} = require('../controller/getprofileController')
const userAuth = require('../middleware/userAuth')

profileRouter.post('/createProfile'  ,createProfile);
profileRouter.get('/getMyProfile' ,userAuth ,getMyProfile);
profileRouter.get('/getProfileUser/:id' ,userAuth ,getProfileUser);
profileRouter.get('/getProfiles' , getProfiles);
profileRouter.put('/editProfile' ,userAuth ,editProfile);
profileRouter.delete('/deleteProfile' ,userAuth ,deleteProfiles);






module.exports={profileRouter}
