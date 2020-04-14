const path = require('path')
const express = require('express')
const app = express()
const hbs = require('hbs')
require('../db/mongoose')
const User = require("./models/user")
const userRouter = require('../src/router/user')

const port = process.env.PORT || 3000


// Defining Paths for Express configuration
const staticPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../HBS/views')
const partialPath = path.join(__dirname, '../HBS/partials')


// Configuring handelbar engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)


// Setting the static directory where all the css, js, image are lives
app.use(express.static(staticPath))
app.use(express.json())
app.use(userRouter)



app.get('', (req, res) => {
    res.render('index', {
        shopName: 'Srivari medicals & Fancies'
    });
});









app.get('/main', (req, res) => {
    res.render('main')
})



app.get('*', (req, res) => {
    res.redirect('/')
})



app.listen(port, () => {
    console.log('server is running @ port: '+port);
})