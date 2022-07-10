const JWT = require('jsonwebtoken');

function jwt(){

    async function create(id){
        try{
            token = JWT.sign({ id }, process.env.JWT_KEY, {
                expiresIn: 60*60*2 // expires in 2 hours
            });

            return token
        }catch(err){
            console.log('[jwt.create] erro ao gerar token:', err)
            throw new Error(500)
        }
    }

    return {create}

}


module.exports = {jwt}