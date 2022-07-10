const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {Op} = require('sequelize');
const model = require('../../../models');
const user = model.User;
const {jwt} = require('../../modules/jwt')

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

    bcrypt.hash(req.body.password, 10, async(err, hash)=>{
        if(err)
            return res.status(500).send('Erro ao criptografar senha');

            now = new Date();
            expire = now.setHours(now.getHours() + 3);

        let response = await user.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            token: token,
            expire: expire,
            state: 'pending',
            tokenValid: expire
        })

        if(!response)
            return res.status(400).send('Erro ao criar usuario');

        res.status(200).send('Usuario criado com sucesso, agora e necessario confirmar o seu email');
    })

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

router.get('/', async(req, res)=>{
    try{

        let response = await user.findOne({
            where: {
                username : req.query.username,
            }
        })


        bcrypt.compare(req.query.password, response.password, async(err, result)=>{
            if(err)
                return res.status(401).send('Não autorizado');

            if(result){
                if(response.state === 'active'){
                    let token = await jwt().create(response.id);
                
                    return res.status(200).send({
                        token: token
                    });
                }else{
                    return res.status(401).send('Usuario não ativado');
                }
            }else{
                return res.status(400).send('Dados não conferem');
            }
        })
        
    }catch(e){
        console.log('[/user/register/active]:', e)
        return res.status(500).send('Erro desconhecido');
    }

})

module.exports = app => app.use('/register', router)