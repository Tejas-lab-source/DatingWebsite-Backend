const User = require('../models/user');

const getUserById = async (req, res) => {
    const {userId} = req.body;
    try {
        const userData = await user.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(
            {
                success: true,
                userData: {
                    _id: userData._id,
                    username: userData.username,
                    email: userData.email,
                    isaccountVerified: userData.isaccountVerified
            }})
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateProfile = async(req,res)=>{
try {
    const {profilePic , bio, fullName} = req.body;
     const userId = req.user._id;
     let updatedUser;
     if(!profilePic)
     {
        updateUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
     }else{
        const upload = await cloudinary.uploader.upload(profilePic);
        updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url, bio, fullname},{new:true})
     }
     res.json({
        success:true, user:updatedUser
     })

} catch (error) {

    console.log(error.message);
    

     res.json({
        success:false, message:error.message
     })

     
}
}
module.exports = {
    getUserById,
    updateProfile
 }


