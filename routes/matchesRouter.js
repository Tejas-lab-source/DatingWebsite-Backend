const express = require('express');
const matchesRouter = express.Router();
const { getAllMatches,deleteMatchById,  checkMatch, randomMatch} = require('../controller/matchController')

const userAuth = require('../middleware/userAuth')

matchesRouter.post('/:matchId', userAuth,checkMatch );
matchesRouter.get('/randomMatch',userAuth ,randomMatch );
matchesRouter.delete('/:matchId',userAuth ,deleteMatchById);

module.exports = matchesRouter;
