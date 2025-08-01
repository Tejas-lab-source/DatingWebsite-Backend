const jwt = require('jsonwebtoken');
const User = require("../models/user")
const userAuth = async (req, res, next) => {
  console.log("hi");

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log(token);
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


    next()

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = userAuth;
