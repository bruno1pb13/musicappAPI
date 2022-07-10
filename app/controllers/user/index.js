
//Esse arquivo identifica todos os outros arquivos deste diretorio e os carrega automaticamente

const fs = require('fs')
const path = require('path')


module.exports = router => {
    fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== 'index.js')))
    .forEach(file => require(path.resolve(__dirname, file))(router))
}