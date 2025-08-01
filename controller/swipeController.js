const User = require('../models/user');

const swipeUserRight = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    // Save the right swipe
    await Swipe.create({
      swiper: userId,
      target: targetUserId,
      direction: 'right'
    });

    // 🔥 Check if target user also swiped right
    const mutualSwipe = await Swipe.findOne({
      swiper: targetUserId,
      target: userId,
      direction: 'right'
    });

    if (mutualSwipe) {
      // 🎉 Mutual right swipes → Create Match
      const [userA, userB] = userId < targetUserId ? [userId, targetUserId] : [targetUserId, userId];

      await Match.create({
        user1: userA,
        user2: userB
      });

      return res.status(200).json({ message: "🎉 It's a match!" });
    }

    res.status(200).json({ message: "Right swipe recorded successfully." });

  } catch (err) {
    console.error("Error in swipeUserRight:", err);
    res.status(500).json({ message: "Server error." });
  }
};
const swipeUserLeft = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    // Save the left swipe
    await Swipe.create({
      swiper: userId,
      target: targetUserId,
      direction: 'left'
    });

    res.status(200).json({ message: "Left swipe recorded successfully." });

  } catch (err) {
    console.error("Error in swipeUserLeft:", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports={
  swipeUserRight,
  swipeUserLeft
}
