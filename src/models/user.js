const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    age: {
        type: Number,
        default: 0,
        validate(age){
            if(age < 0){
                throw new Error('Age should be greater then 0')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(data){
            if(!validator.isEmail(data)){
                throw new Error('Bad email address')
            }
        }
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
        validate(data){
            if(data.toLowerCase().includes('password')){
                throw new Error('Low secure password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.authToken = async function() {
    const user = this
    console.log('Token Created......!')
    const token = await jwt.sign({_id: user._id.toString()}, 'killany1')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        return new Error('Email id not found')
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match){
        return new Error('Password incorrect')
    }
    return user
}


userSchema.pre('save', async function() {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
        console.log('Hassing......!')
    }
})


const User = mongoose.model('Users', userSchema)

module.exports = User