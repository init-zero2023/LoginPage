const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const {sha256} = require('crypto-hash')
const mongoose = require('mongoose')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const auth = require('../src/middleware/auth')


const app = express()
const server = require('http').Server(app)
const port = process.env.PORT
const path = require('path')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))


mongoose.connect("mongodb://localhost:27017/temp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


// token generator

const generateAuthToken = async (user)=>{
    console.log(user)
    const token = jwt.sign({_id: user._id}, process.env.SECRET_CODE, {expiresIn: '10h'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// login

app.get('/', auth, (req, res)=>{
    res.render('main')
})

app.get('/login', (req, res)=>{
    res.render('login', {message: ''})
})

app.post('/login', async(req, res)=>{
    let email = req.body.email
    email = email.toLowerCase()
    let password = await sha256(req.body.password)
    try{
        const user = await User.findOne({email: email})
        if(!user){
            return res.render('login', {message: 'Email ID not register. Please sign up using a valid email.'})
        }
        if(user.password !== password){
            return res.render('login', {message: 'Incorrect password'})
        }
        const token = await generateAuthToken(user)
        console.log(token)
        res.render('home')
    }catch(error){
        console.log(error.message)
        res.render('login', {message: error.message})
    }
})

// signup

app.get('/signup', (req, res)=>{
    res.render('signup', {message: ''})
})

app.post('/signup', async(req, res)=>{
    let email = req.body.email
    email = email.toLowerCase()
    let password = await sha256(req.body.password)
    let newUser = new User({
        email,
        password
    })
    try{
        await newUser.save()
        const token = await generateAuthToken(newUser)
        res.render('home')
    }catch(error){
        res.render('signup', {message: error.message})
    }

})


app.get('/:dest', (req, res)=>{
    res.render('login', {message: ''})
})

server.listen(port, ()=>{
    console.log(`Server is running at port ${port}`)
})


const myFunction = async()=>{
    const token = jwt.sign({_id:'abc1232'}, process.env.SECRET_CODE,{expiresIn:'2 days'})
    console.log(token)
    const data = jwt.verify(token, process.env.SECRET_CODE)
    console.log(data)
}

myFunction()