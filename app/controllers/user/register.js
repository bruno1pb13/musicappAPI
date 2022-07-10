const express = require('express');
const router = express.Router();

const {Op} = require('sequelize');
const model = require('../../../models');
const user = model.User;

router.post('/', async(req, res)=>{

    if(!req.body.username || !req.body.email || !req.body.password)
        return res.status(400).json({
            error: 'Dados insuficientes'
        });
    

    let r = await user.findOne({
        where: {
            [Op.or]: [
                {email: req.body.email},
                {username: req.body.username}
            ]
        }
    })


    
    if(r) // check if user already exist
        if(r.email === req.body.email){
            return res.status(400).send('Email já cadastrado');
        }else{
            return res.status(400).send('Nome de usuario já cadastrado');
        }
    

    let token = Math.floor(Math.random() * 9000) + 1000;
    //create uuid

    now = new Date();
    expire = now.setHours(now.getHours() + 3);

    await user.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        state: 'pending',
        token: token,
        tokenValid: expire,
    })

    res.send(200)
})

router.post('/active/id')

module.exports = app => app.use('/register', router)