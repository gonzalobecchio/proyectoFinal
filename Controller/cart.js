import { CartsFile } from '../Persistence/CartsFile.js'
import { ProductsFile } from '../Persistence/ProductsFile.js'

const CController = {
    createCart : async (req, res) =>{
        const cartsFile = new CartsFile()
        const carts = await cartsFile.getAllCarts()
        const cart = await cartsFile.createCart(carts)
        res.status(201).send({"id": cart.id})
    },
    addProduct: async (req, res) => {
        const { id } = req.params
        const productsFile = new ProductsFile()
        
        const products = await productsFile.allProductsFromFile()
        if (products.length == 0) {
            res.status(404).send({message: 'products empty'})
            return
        }
        const { id_prod } = req.body 
        const product = await productsFile.findByOne(id_prod, products)
        if (!product) {
            res.status(404).send({message: 'product not found'})
            return
        }
        const cartsFile = new CartsFile()
        const allCarts = await cartsFile.getAllCarts()
        /*Verificar si existen carritos*/
        if (allCarts.length == 0) {
            res.status(400).send({message: 'carts empty'})
        }

        /*Busca carrito por id*/
        const cart = await cartsFile.findByid(id, allCarts)
        if (!cart) {
            res.status(404).json({message: 'cart not found'})
            return
        }
        /**Agrega el producto al carrito encontrado */
        const cartUpdated = await cartsFile.addProduct(product, cart)
        await cartsFile.updateCart(id, cartUpdated, allCarts)
        res.send(cartUpdated)
    },
    allProductsFromCart: async (req, res) => {
        const { id } = req.params
        const cartsFile = new CartsFile()
        const carts = await cartsFile.getAllCarts()
        const productsCart = await cartsFile.listProductsByCart(id, carts)
        if (!productsCart) {
            res.status(400).json({message: 'cart not found'})
            return
        }
        res.status(200).send(productsCart)
    },
    deleteProductFromCart: async (req, res) => {
        const { id, id_prod} = req.params
        const cartsFile = new CartsFile()
        
        const carts = await cartsFile.getAllCarts() 
        if (carts.length == 0) {
            res.status(404).json({message: 'no carts'})
            return
        }

        const cart = await cartsFile.findByid(id, carts)
        if (cart.products.length == 0) {
            res.status(404).json({message: 'cart without products'})
            return
        }

        console.log(cart.products) 
        console.log(id_prod)
        const deleted = await cartsFile.deleteProductFromCart(id_prod, cart.products, id, carts)
        if (!deleted) {
            res.status(400).send({message: 'Error deleted process'})
            return
        }
        res.sendStatus(204)
    },
    emptyCart: async (req, res) => {
        const { id } = req.params
        const cartsFile = new CartsFile()
        const carts = await cartsFile.getAllCarts()
        if (carts.length == 0) {
            res.status(404).send({message: 'carts empty'})
            return
        }
        const deleted = await cartsFile.deleteByOne(id, carts)
        if (!deleted) {
            res.status(404).json({message: 'cart not found'})
            return
        }
        res.sendStatus(204)
    }
}

export { CController }