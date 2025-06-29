const express = require('express')
const router = express.Router();
const passport = require('passport');
const Project = require('../models/Project');
const Route = require('../models/Route');
const MockData = require('../models/MockData');
const crypto = require('crypto');


const ensureAuth = (req, res, next) => {
    if(!req.isAuthenticated()) return res.status(401).json({message: "unauthorised"})
    
    return next()
}

const createChunks = (mockData) => {
    
    const chunks = [];
    for (let i = 0; i < mockData.length; i += 100) {
        chunks.push(mockData.slice(i, i + 100));
    }
    return chunks;
}

router.post('/project', ensureAuth, async (req, res)=> {

    try {
        
        const existing = await Project.findOne({ userId: req.user._id, slug: req.body.slug })
        if (existing) {
            return res.status(409).json({ message: "Project slug already exists." })
        }

        const apiKey = crypto.randomBytes(32).toString('hex');

        const newProject = await Project.create({
            userId: req.user._id,
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            apiKey: apiKey
        })
        res.status(201).json(newProject)
} catch (err) {return res.status(500).json({message:'Internal server error', err})}
})

router.post('/route', ensureAuth, async (req, res)=> {

    // if(mockData?.length > 0) {
    //     const chunks = createChunks(mockData).map((chunk, idx)=>{
    //         routeId,

    //     })
    // }
    try {

        const {projectId, path, methods, logic, schema, mockData} = req.body

        
        const project = await Project.findOne({ _id: projectId, userId: req.user._id })
        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorised." })
        }

        const existing = await Route.findOne({ ProjectId: projectId, path})
        if (existing){
            return res.status(409).json({ message: "Route path name already exists." })
        }

        const route = await Route.create({
            ProjectId:projectId,
            userId: req.user._id,
            path,
            methods,
            logic: logic || {},
            schema
        })
        
        const routeId = route._id

        if (Array.isArray(mockData) && mockData.length > 0) {
            const chunks = createChunks(mockData);
            // Insert each chunk as a MockData document
            await Promise.all(
            chunks.map((chunk, idx) =>
                MockData.create({
                routeId: routeId,
                index: idx,
                data: chunk
                })
            )
            );
        }


        res.status(201).json({message:'Route created'})

} catch (err) {
    console.error(err)
    return res.status(500).json({message:'Internal server error', err})}
})


module.exports = router