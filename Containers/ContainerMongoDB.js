import  Product  from '../ModelsMongo/products.js'
import  Cart  from '../ModelsMongo/carts.js'

import mongoose from 'mongoose'

class ContainerMongoDB {
    constructor(){
        try {
            mongoose.connect('mongodb+srv://admin:admin@cluster0.hrhi6u4.mongodb.net/?retryWrites=true&w=majority')
            // console.log('Conexion exitosa con MongoDB Atlas')
        } catch (error) {
            console.log(error)
        }
    }

    /***********************Métodos de Carrito****************************/ 
    getAllCarts = async () => {
        return await Cart.find({})
    }

    create = async (_id) => {
        try {
            const carts = await this.getAllCarts()
            const cart = {}
            cart.products = []
            cart._id = carts.length == 0 ?  1 : carts.length + 1
            cart.user_id = _id
            const newCart = new Cart(cart)
            newCart.save()            
            return cart
        } catch (error) {
            console.error(`Error Catched: ${error}`)
        }
    }

    /*find by id*/ 
    fByid = async (_id) => {
        return await Cart.findById({_id}).exec()
    }

    /*Retorna el carrito del usuario logeado*/ 
    fByUserLogin = async (user_id) => {
        return await Cart.findOne({ user_id })
    }

    addProduct = async (_id, product, cart) => {
        const { products } = cart
        products.push(product)
        return await Cart.updateOne({_id: _id}, {$set: {products}})
    }


    
    /*Elimina Carrito*/
    dByOne = async (_id) => {
        try {
            return await Cart.deleteOne({_id})
        } catch (error) {
            console.log(error)
        }
    }


    /*Elimina un producto del carrito de compra*/
    dProductFromCart = async (_id, id_prod) => {
        try {
            const cart = await this.fByid(_id)
            const { products } = cart
            // console.log(`Este es el id producto: ${id_prod}`)
            // console.log(products)
            if (!products) {
                return false
            }
            const indexProduct = products.findIndex(product => product._id == id_prod)
            if (indexProduct == -1) {
                return false
            }

            products.splice(indexProduct, 1)
            await Cart.updateOne({_id}, {$set: {products}})
            return true
        } catch (error) {
            console.error(`Error Catched in deleteProductFromCart: ${error}`)
        }

    }

    /**Lista los productos por carrito seleccionado */
    listProducts  = async (_id) => {
        return await Cart.findById({_id})
    }

    dByUserLogin = async (user_id) => {
        return Cart.deleteByOne({'user_id' : user_id })
    }



    /***********************Metodos de Productos****************************/ 

    generateId = () => {}

    allProductsFromFile = async () => {
        try {
            return await Product.find().lean()
        } catch (error) { console.log(error)}
    }

    findByOne = async (_id) => {
        try {
            return await Product.findById(_id).exec()
        } catch (error) {
            console.log(error)
        }
    }
    
    save = async (product) => {
        const newProduct = new Product(product)
        newProduct.save()
    }

    updateByOne = async (_id, product) => {
        try {
            await Product.updateOne({_id},  {product})
        } catch (error) {
            console.log(error)
        }
    }

    deleteByOne = async (_id) => {
        try {
            return await Product.deleteOne({_id})
        } catch (error) {
            console.log(error)
        }
    }


    /*****************************Métodos de Auth*********************************** */

}

export { ContainerMongoDB } 