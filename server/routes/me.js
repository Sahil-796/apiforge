const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const Project = require('../models/Project')
const Route = require('../models/Route')

const ensureAuth = (req, res, next) => {
    if(!req.isAuthenticated()) {
        
        console.log(req.user)
        return res.status(401).json({message: "unauthorised"})}
    
    return next()
}

router.get('/me', ensureAuth, async (req, res)=> {
    const userProjects = await Project.find({userId:req.user._id}).sort({updatedAt: -1})


    const data = {
        username: req.user.username,
        email: req.user.email,
        projects: (userProjects || [])
    }
    return res.status(200).json(data)
})


router.post('/routes', ensureAuth, async (req, res)=> {

    const routes = await Route.find({ProjectId:req.projectId}).sort({updatedAt: -1})

    if(!routes) return res.status(404).json({message:"Routes not found"})

    return res.status(200).json(routes)
})

module.exports = router