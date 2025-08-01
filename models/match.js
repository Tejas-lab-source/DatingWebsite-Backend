// const User = require('../models/user');

// // Utility function: Get common interests
// function getCommonInterests(userA, userB) {
//   return userA.interests.filter(interest => userB.interests.includes(interest));
// }

// // Utility function: Shuffle array
// function shuffle(array) {
//   return array.sort(() => Math.random() - 0.5);
// }

// // Matchmaking Controller
// const findMatch = async (req, res) => {
//   try {
//     const currentUserId = req.body.userId;

//     // Fetch current user
//     const currentUser = await User.findById(currentUserId);
//     if (!currentUser) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Fetch potential matches (exclude self)
//     const potentialMatches = await User.find({
//       _id: { $ne: currentUserId },
//       isOnline: true
//     });

//     // Filter & score
//     const scoredMatches = potentialMatches.map(user => {
//       const common = getCommonInterests(currentUser, user);
//       const totalUniqueInterests = new Set([...currentUser.interests, ...user.interests]).size;
//       const compatibilityScore = (common.length / totalUniqueInterests) * 100;

//       return {
//         user,
//         compatibilityScore
//       };
//     }).filter(match => match.compatibilityScore >= 30); // Threshold = 30%

//     // Shuffle to randomize
//     const shuffled = shuffle(scoredMatches);

//     if (shuffled.length === 0) {
//       return res.status(200).json({ message: "No compatible match found. Try again later." });
//     }

//     // Return the first match
//     const bestMatch = shuffled[0];
//     res.status(200).json({
//       match: {
//         username: bestMatch.user.username,
//         interests: bestMatch.user.interests,
//         compatibilityScore: bestMatch.compatibilityScore.toFixed(2)
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error." });
//   }
// };

// module.exports = { findMatch };
