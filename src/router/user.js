const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')
const router = new express.Router


router.get('/users', async (req, res) => {
    
    try{
        const users = await User.find()
        res.send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const id = req.params.id
    const updateAvailable = ['name', 'age', 'email', 'password']
    const updaters = Object.keys(req.body)
    const match = updaters.every(data => updateAvailable.includes(data))

    if(!match){
        return res.send(400).send('There is no field')
    }

    try{
        const user = await User.findById(id)
        updaters.forEach( (data) => {
            user[data] = req.body[data]
        })
        await user.save()

        if(!user){
            return res.status(404).send()
        }
        res.status(201).send(user)

    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {

    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send('No user found to delete')
        }
        res.status(201).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/me', auth, async (req, res) => {

    res.send(req.user)

})

router.post('/users/signup', async (req, res) => {
    const user = User(req.body)

    try{
        await user.save()
        const token = await user.authToken()
        res.status(200).send({user, token})
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.authToken()
        res.status(200).send({user, token})

    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {

    try{
        const token = req.token
        req.user.tokens = req.user.tokens.filter((data) => {
            return data.token !== token
        })
        await req.user.save()
        res.send('User loggedoff.......!')
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        req.user.save()

        res.send('Logged out from all machines.....!')
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router