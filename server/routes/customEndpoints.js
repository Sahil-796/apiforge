const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const Route = require('../models/Route')
const MockData = require('../models/MockData')
const { v4: uuidv4 } = require('uuid');
const runIsolatedFunction = require('../config/ivm')


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

        const route = await Route.findOne({ path: `/${path}`, ProjectId: project._id })
        console.log(project)
        if (!route) return res.status(404).json({ message: 'Route not found' })
        
        let found = false
        if (route.methods.length > 0) {
            for (let i = 0; i<route.methods.length; i++){
                if (route.methods[i]==='GET'){
                    found = true
                    break
                }
            }
        }

        if (!found){
            return res.status(405).json({message: 'Method not allowed'})
        }

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
    
    const route = await Route.findOne({path:`/${path}`, ProjectId: project._id})
    if(!route) return res.status(404).json({message:'Route not found'})

    let found = false
    if (route.methods.length > 0) {
        for (let i = 0; i<route.methods.length; i++){
            if (route.methods[i]==='GET'){
                found = true
                break
            }
        }
    }

    if (!found){
        return res.status(405).json({message: 'Method not allowed'})
    }
   
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
        let data = req.body 

        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ message: 'API key missing in headers' })
        }

        const project = await Project.findOne({ apiKey: apiKey, slug: slug })
        if (!project) return res.status(404).json({ message: 'Project not found' })
       
        const route = await Route.findOne({ path: `/${path}`, ProjectId: project._id })
        
        let found = false
        if (route.methods.length > 0) {
            for (let i = 0; i<route.methods.length; i++){
                if (route.methods[i]==='POST'){
                    found = true
                    break
                }
            }
        }

        if (!found){
            return res.status(405).json({message: 'Method not allowed'})
        }


        if (!route) return res.status(404).json({ message: 'Route not found' })

        if (route.logic) {
            console.log(route.logic)
            try {
                data = await runIsolatedFunction(route.logic, data);
                
            } catch (err) {
                return res.status(400).json({ message: 'Invalid custom logic', error: err.message });
            }
        }

        const newData = {
            ...data,
            id: uuidv4()
        }
        let lastChunk = await MockData.findOne({ routeId: route._id }).sort({ index: -1 })

            

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

        res.status(201).json({ success: true, data: newData });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
})


router.delete('/:slug/:path/:id', async (req, res)=> {

    try {
        const {slug, path, id} = req.params

        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ message: 'API key missing in headers' });
        }

        const project = await Project.findOne({ apiKey: apiKey, slug: slug })
        if (!project) return res.status(404).json({ message: 'Project not found' })

        const route = await Route.findOne({ path: path, ProjectId: project._id })
        if (!route) return res.status(404).json({ message: 'Route not found' })

        let found = false
        if (route.methods.length > 0) {
            for (let i = 0; i<route.methods.length; i++){
                if (route.methods[i]==='DELETE'){
                    found = true
                    break
                }
            }
        }

        if (!found){
            return res.status(405).json({message: 'Method not allowed'})
        }

        const result = await MockData.updateOne(
            { routeId: route._id, 'data.id': id },
            { $pull: { data: { id } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        return res.status(200).json({message: "successfully deleted"})

    } catch (err){
        console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
})


router.put('/:slug/:path/:id', async (req, res)=> {

    try {
        const {slug, path, id} = req.params

        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return res.status(401).json({ message: 'API key missing in headers' });
        }

        const newObj = {
            ...req.body,
            id: req.params.id // ensure id stays same
        };

        const project = await Project.findOne({ apiKey: apiKey, slug: slug })
        if (!project) return res.status(404).json({ message: 'Project not found' })

        const route = await Route.findOne({ path: path, ProjectId: project._id })
        if (!route) return res.status(404).json({ message: 'Route not found' })

        let found = false
        if (route.methods.length > 0) {
            for (let i = 0; i<route.methods.length; i++){
                if (route.methods[i]==='PUT'){
                    found = true
                    break
                }
            }
        }

        if (!found){
            return res.status(405).json({message: 'Method not allowed'})
        }

        const result = await MockData.updateOne(
            { routeId: route._id, 'data.id': id },
            { $set: { 'data.$': newObj } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        return res.status(200).json({message: "Successfully updated"})

    } catch (err){
        console.error(err)
        return res.status(500).json({ message: 'Internal server error', error: err.message })
    }
})


router.patch('/:slug/:path/:id', async (req, res) => {
  try {
    const { slug, path, id } = req.params;

    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ message: 'API key missing in headers' });
    }

    const project = await Project.findOne({ apiKey: apiKey, slug: slug });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const route = await Route.findOne({ path: path, ProjectId: project._id });
    if (!route) return res.status(404).json({ message: 'Route not found' });

    // Construct $set dynamically for only the fields provided
    const patchFields = Object.fromEntries(
      Object.entries(req.body).map(([key, val]) => [`data.$.${key}`, val])
    );

    // Optional: Prevent patching internal/reserved fields
    if ('_id' in req.body || 'routeId' in req.body) {
      return res.status(400).json({ message: 'Cannot modify protected fields' });
    }

    const result = await MockData.updateOne(
      { routeId: route._id, 'data.id': id },
      { $set: patchFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Data object not found' });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes were made' });
    }

    return res.status(200).json({ message: 'Successfully updated' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


module.exports = router