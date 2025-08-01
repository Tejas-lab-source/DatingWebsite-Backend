const  User  = require('../models/user');

async function search(req, res) {
  try {
    const UserID = req.headers['userid'];
     console.log('hi');
     
    // Find all users except the one with the given UserID
     const mockProfiles = await User.find({ _id: { $ne: UserID } });

    res.status(200).send(mockProfiles);
  } catch (err) {
    console.error("Error in search:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { search };
