import mongoose from "mongoose";
const { Schema } = mongoose

const Cart = new mongoose.model('Cart', new Schema({
    _id: {
        type: 'Number',
        required: true,
    },
    products: {
        type: Schema.Types.Mixed
    },


}, {timestamps: true}))

export default Cart