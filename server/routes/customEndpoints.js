const express = require('express')
const router = express.Router()
const project = 


router.get('/:slug/:path', async(req, res)=>{
    
    const apiKey = req.headers['x-api-key'];    
    const slug = req.params.slug
    const path = req.params.path


})