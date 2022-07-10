const express = require('express');
const router = express.Router();

require('./user/index')(router)

module.exports = app => app.use('/user', router)