const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next)=>{
    try{
        // console.log(req.cookies.token)
        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.cookies.token
        console.log('A new token received', token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_CODE)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    }catch(error){
        res.render('login', {message:''})
    }
}

module.exports = auth