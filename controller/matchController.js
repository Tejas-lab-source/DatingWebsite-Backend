
const User = require('../models/user');



/**
 * GET /matches
 * Return an array of all match cards
 */
async function getAllMatches(req, res, next) {
  try {
    const matches = await User.find({}, '_id date teams location').lean();
    const cards = matches.map(m => ({
      id: m._id,
      date: m.date,
      teams: m.teams,
      location: m.location
    }));
    res.json(cards);
  } catch (err) {
    next(err);
  }
}


async function checkMatch(req, res)
 {
  try {
    console.log("1");
    
    const UserID = req.headers['userid']; 
    console.log("2");
  const {matchId} = req.params //
  console.log(matchId);
  
  console.log("3");

  await User.findByIdAndUpdate(UserID , { $addToSet: { rightSwipe: matchId } })
  console.log("4");
   
  const array = await User.findById(matchId)
  console.log(array);
  
  console.log("5");
  const rightSwipeArray = array.rightSwipe || []
  console.log("6");

  const isMatch = rightSwipeArray.map(id => id.toString()).includes(UserID);
  console.log("7");

   if (isMatch) {
    console.log("8");
      return res.status(200).json({ match: true, message: "It's a match!" });
    } else {
      console.log("9");
      return res.status(200).json({ match: false, message: "No match yet." });
    }
   console.log("10");
  } 
  catch (error) {
    console.log("11");
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }

}


async function deleteMatchById(req, res, next) {
  try {
    const match = await User.findByIdAndDelete(req.params.matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function randomMatch(req, res) {
  try {
    console.log("random ");
    
    // Helper function to get a random element from an array
    function getRandomElement(arr) {
      if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error("Input must be a non-empty array");
      }
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }

    const UserID = req.headers['userid']; 
    const user = await User.findById(UserID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const gender = user.gender;
    let profiles = [];  // Changed to let to allow reassignment

    if (gender === 'male') {
      profiles = await User.find({ gender: "female" });
      const randomPerson = getRandomElement(profiles);

      if (!randomPerson) {
        return res.status(404).json({ message: "No female profiles available" });
      }
        console.log(randomPerson);
        
      return res.status(200).send(randomPerson);  // Returning the matched profile

    } else if (gender === 'female') {
      // Handle case where gender is female, maybe match with male users?
      profiles = await User.find({ gender: "male" });
      const randomPerson = getRandomElement(profiles);

      if (!randomPerson) {
        return res.status(404).json({ message: "No male profiles available" });
      }

      return res.status(200).json(randomPerson);  // Returning the matched profile
    } else {
      return res.status(400).json({ message: "Invalid gender" });
    }

  } catch (error) {
    console.error("Error in randomMatch:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  getAllMatches,
  
  deleteMatchById,  checkMatch,randomMatch
};
