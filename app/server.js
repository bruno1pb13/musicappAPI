
require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.HTTP_PORT || 5000
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./controllers')(app)

function server(){
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}



module.exports = {server}