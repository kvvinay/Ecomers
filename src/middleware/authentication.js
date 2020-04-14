const User = require('../models/user')
const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {

    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        
        const debug = await jwt.verify(token, 'killany1')
        const user = await User.findOne({_id: debug._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        
        req.user = user
        req.token = token
        
        next()

    }catch(e){
        res.status(404).send({error: 'Please authenticate.......!'})
    }
}




module.exports = auth