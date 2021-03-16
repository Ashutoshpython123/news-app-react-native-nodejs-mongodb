const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    Avatar: {
        type: String,
        default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fvector-images%2Fdefault-avatar.html&psig=AOvVaw0nDXP6xhuJ6HLVE_Z2MBR1&ust=1615063731632000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPCwubODmu8CFQAAAAAdAAAAABAD'
    },
    role: {
        type: String,
        default: 'user'
    },
    gender: {
        type: String,
        default: 'male'
    },
    mobile: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    website: {
        type: String,
        default: ''
    },
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref : 'user'
        }
    ],
    following : [
        {
            type : mongoose.Types.ObjectId,
            ref : 'user'
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)