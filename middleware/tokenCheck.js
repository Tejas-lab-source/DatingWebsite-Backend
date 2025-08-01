const User = require('../models/user')
const jwt = require("jsonwebtoken")
require('dotenv').config()



const tokenCheck = async (req, res ) => {
console.log("hi");

  try {
    console.log("reached to token prev");
  const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1]; 
console.log("reached to token");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }    
    const user = await User.findOne({ _id: decoded.userId });
  
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access: User not found" });
    }

 
 
    res.status(200).json({UserID: decoded.UserId})

    // Continue to the next middleware/route

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports={tokenCheck}
