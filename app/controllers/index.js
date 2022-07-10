
//Esse arquivo identifica todos os outros arquivos deste diretorio e os carrega automaticamente

const fs = require('fs')
const path = require('path')


module.exports = app => {
    fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js') && (file.slice(-3) === '.js')))
    .forEach(file => require(path.resolve(__dirname, file))(app))
}