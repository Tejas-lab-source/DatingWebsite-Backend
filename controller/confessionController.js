const { config } = require('dotenv');
const Confession = require('../models/confession');

// 🔥 Post a new confession
const createConfession = async (req, res) => {
  try {
   const UserID = req.headers['userid']; 
    const {  confession, isAnonymous } = req.body;

    if (!confession || confession.trim() === '') {
      return res.status(400).json({ message: "Confession content cannot be empty." });
    }

    const newConfession = await Confession.create({
      UserID: UserID,
      confession,
      isAnonymous: isAnonymous || false
    });
    console.log(newConfession);
    

    res.status(201).json({ message: "Confession posted successfully!", confession: newConfession });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// 📝 Get all confessions
const getAllConfessions = async (req, res) => {
  try {

       const UserID = req.headers['userid']; 
    const page =parseInt(req.query.page)||1;
    const limit =parseInt(req.query.limit)||10;
    const skip =(page-1)*limit;

    
    const confessions = await Confession.find()
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .populate('UserID') // Get username & profile pic of posters
      .select('-__v'); // Clean response

      console.log(confessions,'hi' );
      
    // Replace username with "Anonymous" if isAnonymous = true
    const formatted = confessions.map(conf => ({
      _id:conf._id,
      content: conf.confession,
      likes: conf.likes.length,
      createdAt: conf.createdAt,
      user: 'Anonymous'
    }));
console.log(formatted);

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ❤️ Like/Unlike a confession
const toggleLike = async (req, res) => {
  try {
    const { userId, confessionId } = req.body;

    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found." });
    }

    const index = confession.likes.indexOf(userId);

    if (index === -1) {
      // Not liked yet → add like
      confession.likes.push(userId);
    } else {
      // Already liked → remove like
      confession.likes.splice(index, 1);
    }

    await confession.save();

    res.status(200).json({ message: "Like status updated.", likes: confession.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ PUT: Edit an existing confession
const editConfession = async (req, res) => {
  try {
    const { userId, confessionId, newContent } = req.body;

    // Validate input
    if (!newContent || newContent.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Confession content must be at least 5 characters." });
    }

    // Find confession
    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ success: false, message: "Confession not found." });
    }

    // Check if the user owns this confession
    if (confession.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You are not allowed to edit this confession." });
    }

    // Update confession content
    confession.content = newContent.trim();
    confession.updatedAt = Date.now(); // optional: add updatedAt field

    await confession.save();

    res.status(200).json({
      success: true,
      message: "Confession updated successfully.",
      confession: {
        _id: confession._id,
        content: confession.content,
        isAnonymous: confession.isAnonymous,
        createdAt: confession.createdAt,
        updatedAt: confession.updatedAt
      }
    });

  } catch (err) {
    console.error("Error editing confession:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ✅ DELETE: Delete a confession
const deleteConfession = async (req, res) => {
  try {
    const { userId, confessionId } = req.body;

    // Validate input
    if (!confessionId || !userId) {
      return res.status(400).json({ success: false, message: "Confession ID and User ID are required." });
    }

    // Find confession
    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ success: false, message: "Confession not found." });
    }

    // Check if the user owns this confession
    if (confession.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You are not allowed to delete this confession." });
    }

    // Delete the confession
    await Confession.findByIdAndDelete(confessionId);

    res.status(200).json({
      success: true,
      message: "Confession deleted successfully."
    });

  } catch (err) {
    console.error("Error deleting confession:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
module.exports={
  createConfession,
  getAllConfessions,
  toggleLike,
  editConfession,
  deleteConfession
}
