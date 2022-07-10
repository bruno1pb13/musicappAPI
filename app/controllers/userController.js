const express = require('express');
const router = express.Router();

require('./user/register')(router)

module.exports = app => app.use('/user', router)