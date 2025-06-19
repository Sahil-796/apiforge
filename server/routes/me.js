const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const Project = require('../models/Project')
const Route = require('../models/Route')

const ensureAuth = (req, res, next) => {
    if(!req.isAuthenticated()) return res.status(401).json({message: "unauthorised"})
    
    return next()
}

router.get('/me', ensureAuth, async (req, res)=> {
    const userProjects = await Project.find({userId:req.user._id})


    const data = {
        username: req.user.username,
        email: req.user.email,
        projects: (userProjects || [])
    }
    return res.json(data)
})


module.exports = router