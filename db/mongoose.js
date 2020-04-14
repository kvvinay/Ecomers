const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/billing-mechine'
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})