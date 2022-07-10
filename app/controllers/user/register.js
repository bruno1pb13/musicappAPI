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

    res.send(200).status('Usuario criado com sucesso, agora e necessario confirmar o seu email');
})

router.post('/active', async(req,res)=>{
    try{
        if(!req.body.username || !req.body.token){
            return res.status(400).json({
                error: 'Dados insuficientes'
            });
        }
        
        username = req.body.username;
        token = req.body.token;

        let response = await user.findOne({
            where: {
                username: username,
                token: token,
                state: 'pending'
            }
        })

        if(!response)
            return res.status(404).send('Dados não conferem');

        if(new Date() > response.tokenValid)
            return res.status(400).send('Token expirado');

        await response.update({
            state: 'active'
        })

        res.status(200).send('Usuario ativado com sucesso')
    }catch(e){
        console.log('[/user/register/active]:', e)
        return res.status(500).send('Erro desconhecido');
    }

})

module.exports = app => app.use('/register', router)