const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const otpStore = new Map(); // key: email, value: { otp, expiresAt }

require('dotenv').config()

const createProfile = async (req, res) => {
  try {
    console.log('1');
    
    const { name, email, password, age, profile ,gender, year, interests } = req.body;
    console.log(profile);
    
    if (!name || !password || !email || !age || !gender || !year ||!profile) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      profile,
      gender,
      year,
      interests,

    });



    res.status(201).json({ message: "User registered successfully", user: { name } });

  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const editProfile = async (req, res) => {
console.log('1');

  try {
    const UserID = req.headers['userid'];
    const { bio, age, year, profile } = req.body;

    const updateData = {}
    if (bio) updateData.bio = bio;
    if (age) updateData.age = age;
    if (year) updateData.year = year;
    if (profile) updateData.profile = profile;

    console.log(updateData);
    console.log(updateData.profile);
    
    
    const updatedUser = await User.findByIdAndUpdate(UserID, updateData, { new: true });
console.log("check");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    })
  } catch (error) {
    console.log("updated profile error", error);
    res.status(500).json({ error: "server error" })

  }
}

const getMyProfile = async (req, res) => {

  try {
   

    const UserID = req.headers['userid'];
    

    const user = await User.findById(UserID).select("-password");
    

    if (!user) {
     

      return res.status(404).json({ error: "User not found" })
    }
    

    res.status(200).send(user)
   

  } catch (error) {
    

    console.error("get profile error", error);
    res.status(500).json({ error: "server error" })
  }
}

const getProfileUser = async (req, res) => {
  try {
    
    const userId = req.params.id;
    const userP = await User.findById(userId).select("-password")
     
     
    if (!userP) {
      return res.status(404).json({ error: "user not found" })
    }
    res.status(200).json({ userP })

  } catch (error) {
    console.error("get other user profile error", error)
    res.status(500).json({ error: "server error" })
  }
}

const getProfiles = async (req, res) => {
  try {
    const UserID = req.headers['userid'];
    const myid = await User.findById(UserID);

    // Checking if the user exists
    if (!myid) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profiles = [];

    // Adjusted gender logic
    if (myid.gender === 'male') {
      profiles = await User.find({ gender: 'female' });
    } else if (myid.gender === 'female') {
      profiles = await User.find({ gender: 'male' });
    } else {
      return res.status(400).json({ message: 'Invalid gender' });
    }

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'No profiles found' });
    }

    return res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteProfiles = async (req, res) => {
  try {
    const UserID = req.headers['userid'];

    // Check if UserID exists
    if (!UserID) {
      return res.status(400).json({ error: 'UserID is required' });
    }

    // Try to find and delete the user
    const user = await User.findByIdAndDelete(UserID);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error("Deleted user error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { createProfile, editProfile, getMyProfile, getProfileUser, getProfiles, deleteProfiles }