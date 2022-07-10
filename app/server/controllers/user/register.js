const express = require('express');
const router = express.Router();


router.post('/', async(req, res)=>{
    res.send(200)
})



module.exports = app => app.use('/register', router)