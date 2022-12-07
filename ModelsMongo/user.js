import mongoose from "mongoose";
const { Schema } = mongoose

const User = new mongoose.model('User', new Schema({
    _id: {
        type: 'Number',
    },
    email: {
        type : 'String',
    },
    password: {
        type: 'String'
    },
    name : {
        type: 'String'
    },
    address : {
        type: 'String'
    },
    age: {
        type: 'Number'
    },
    phone: {
        type: 'String'
    },
    file:{
        type: 'String'
    },
    extFile:{
        type: 'String'
    },

}, {timestamps: true}))

export  { User }