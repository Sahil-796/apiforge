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
    const allRoutes = await Route.find({userId:req.user._id})

    
    const projects = userProjects.map( project => {
        const projectRoutes = allRoutes.filter(route => String(route.ProjectId) === String(project._id))
        return {
            ...project.toObject(),
            routes: projectRoutes
        }
    })
    

    const data = {
        username: req.user.username,
        email: req.user.email,
        projects: projects

    }
    return res.json(data)
})


module.exports = router