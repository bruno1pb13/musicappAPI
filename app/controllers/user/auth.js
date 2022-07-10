const express = require('express');
const router = express.Router();

const {Op} = require('sequelize');
const model = require('../../../models');
const user = model.User;

router.post('/', async(req, res)=>{
    res.send(200).status('Usuario criado com sucesso, agora e necessario confirmar o seu email');
})


module.exports = app => app.use('/auth', router)