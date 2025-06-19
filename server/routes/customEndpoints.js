const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const Route = require('../models/Route')
const MockData = require('../models/MockData')
const { v4: uuidv4 } = require('uuid');


router.get('/:slug/:path', async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ message: 'API key missing in headers' });
        }

        const slug = req.params.slug
        const path = req.params.path

        const page = parseInt(req.query.page || '0', 10);

        const project = await Project.findOne({ apiKey: apiKey, slug: slug })
        if (!project) return res.status(404).json({ message: 'Project not found' })

        const route = await Route.findOne({ path: path, ProjectId: project._id })
        if (!route) return res.status(404).json({ message: 'Route not found' })

        const mockData = await MockData.findOne({ routeId: route._id, index: page })
        if (!mockData) return res.status(404).json({ message: 'Mock Data not found' })

        return res.status(200).json(mockData.data)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
})


router.get('/:slug/:path/:id', async(req, res)=>{

    try {
    
    const apiKey = req.headers['x-api-key'];  
    if (!apiKey) {
        return res.status(401).json({ message: 'API key missing in headers' });
    }
    
    const slug = req.params.slug
    const path = req.params.path

    const project = await Project.findOne({apiKey:apiKey, slug:slug})
    if(!project) return res.status(404).json({message:'Project not found'})
    
    const route = await Route.findOne({path:path, ProjectId: project._id})
    if(!route) return res.status(404).json({message:'Route not found'})
   
    const chunk = await MockData.findOne({
        routeId: route._id,
        'data.id': req.params.id
        });

    if (!chunk) return res.status(404).json({ error: 'Not found' });

        const item = chunk.data.find(doc => doc.id === req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });

        return res.status(200).json(item);

    }catch (err) {
         console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
})


router.post('/:slug/:path', async (req, res) => {
    try {
        const slug = req.params.slug
        const path = req.params.path
        const data = req.body 

        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ message: 'API key missing in headers' });
        }

        const project = await Project.findOne({ apiKey: apiKey, slug: slug })
        if (!project) return res.status(404).json({ message: 'Project not found' })

        const route = await Route.findOne({ path: path, ProjectId: project._id })
        if (!route) return res.status(404).json({ message: 'Route not found' })

        let lastChunk = await MockData.findOne({ routeId: route._id }).sort({ index: -1 })

        const newData = {
                ...data,
                id: uuidv4()
            }
            

        if (!lastChunk) {
            lastChunk = await MockData.create({
                routeId: route._id,
                index: 0,
                data: [newData]
            });
        }

        else if (lastChunk && lastChunk.data.length < 100) {
            lastChunk.data.push(newData)
            await lastChunk.save()
        }

        else {
            await MockData.create({
                routeId: route._id,
                index: lastChunk.index + 1,
                data: [newData]
            });
        }

        res.status(201).json({ success: true, data: newDoc });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
})


module.exports = router