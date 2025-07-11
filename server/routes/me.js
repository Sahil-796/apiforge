const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const Project = require('../models/Project')
const Route = require('../models/Route')

const ensureAuth = (req, res, next) => {

    console.log('=== ENSURE AUTH DEBUG ===');
    console.log('Session ID:', req.sessionID);
    console.log('Session exists:', !!req.session);
    console.log('User in session:', !!req.user);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('Session data:', req.session);
    console.log('Cookies received:', req.headers.cookie);
    if(!req.isAuthenticated()) {
        

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


router.post('/routes',  async (req, res)=> {

    const routes = await Route.find({ProjectId:req.body.projectId}).sort({updatedAt: -1})

    if(!routes) return res.status(404).json({message:"Routes not found"})

    return res.status(200).json(routes)
})

module.exports = router