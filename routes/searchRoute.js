const express = require('express')
const {search} = require('../controller/searchController')
const searchProfileRouter = express.Router()
const userAuth=require('../middleware/userAuth')
searchProfileRouter.get("/profile",userAuth,search)

module.exports={searchProfileRouter}