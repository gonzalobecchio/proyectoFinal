import mongoose from "mongoose"
const { Schema } = mongoose

const Product = mongoose.model('Product', new Schema({
    _id: {
        type: 'Number',
        required: true,
    },
    name: {
        type: 'String', 
        required: true,
    }, 
    description: {
        type: 'String', 
        required: true,
        minLength: 10,
        maxLength: 255,
    },
    code: {
        type: 'String', 
        required: true,
    }, 
    picture: {
        type: 'String', 
        required: true,
        minLength: 10,
        maxLength: 255,
    },
    price: {
        type: 'Number',
        required: true,
    },
    stock: {
        type: 'Number',
        required: true,
    }    
}, { timestamps: true }))

export default Product 