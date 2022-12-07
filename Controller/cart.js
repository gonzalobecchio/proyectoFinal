// import { CartsFile } from '../Persistence/CartsFile.js'
// import { ProductsFile } from '../Persistence/ProductsFile.js'

import NodeMailer from '../Emails/NodeMailer.js'
import Message from '../Messages/Message.js'
import { productDAOS, cartDAOS } from '../DAOs/index.js' 

const CController = {
    createCart : async (req, res) =>{
        if (!req.isAuthenticated()) {
            res.status(401).json({message: `Unauthorized`})
            return
        }
        
        /*Obtenemos el id del usuario logueado*/ 
        const { _id } = req.user
        /*Hacemos busqueda del carrito del usuario*/
        const cartFound = await cartDAOS.cartUserLoggin( _id )

        const cart =  cartFound  ?? await cartDAOS.createCart( _id )
        res.status(201).send({"id": cart._id})
    },
    addProduct: async (req, res) => {
        const { id } = req.params
        
        const products = await productDAOS.allProductsFromFile()
        if (products.length == 0) {
            res.status(404).send({message: 'products empty'})
            return
        }
        const { id_prod } = req.body 
        const product = await productDAOS.findByOne(id_prod)
        if (!product) {
            res.status(404).send({message: 'product not found'})
            return
        }
        const allCarts = await cartDAOS.getAllCarts()
        /*Verificar si existen carritos*/
        if (allCarts.length == 0) {
            res.status(400).send({message: 'carts empty'})
        }

        /*Busca carrito por id*/
        const cart = await cartDAOS.findByid(id)
        if (!cart) {
            res.status(404).json({message: 'cart not found'})
            return
        }
        /**Agrega el producto al carrito encontrado */
        console.log(`carrito ${id}`, cart)
        const cartUpdated = await cartDAOS.addProd(id, product, cart)
        // console.log(cartUpdated)
        res.status(200).send(cartUpdated)
    },
    allProductsFromCart: async (req, res) => {
        const { id } = req.params
        const productsCart = await cartDAOS.listProductsByCart(id)
        if (!productsCart) {
            res.status(400).json({message: 'cart not found'})
            return
        }
        res.status(200).send(productsCart)
    },
    deleteProductFromCart: async (req, res) => {
        const { id, id_prod} = req.params
        
        const carts = await cartDAOS.getAllCarts() 
        if (carts.length == 0) {
            res.status(404).json({message: 'no carts'})
            return
        }

        // console.log(carts.products)
        const cart = await cartDAOS.findByid(id)
        if (cart.products.length == 0) {
            res.status(404).json({message: 'cart without products'})
            return
        }
        
        const deleted = await cartDAOS.deleteProductFromCart(id, id_prod)
        console.log(deleted)
        if (!deleted) {
            res.status(400).send({message: 'Error deleted process'})
            return
        }
        res.sendStatus(204)
    },
    emptyCart: async (req, res) => {
        const { id } = req.params
        // const cartsFile = new CartsFile()
        const carts = await cartDAOS.getAllCarts()
        if (carts.length == 0) {
            res.status(404).send({message: 'carts empty'})
            return
        }

        const cart = await cartDAOS.fByid(id)
        if (!cart) {
            res.status(404).json({message: 'cart not found'})
            return
        }

       await cartDAOS.deleteByOne(id)
        res.sendStatus(204)
    },
    sendCart: async (req, res) => {
        if (!req.isAuthenticated()) {
            res.status(401).send({message: 'Unauthorized'})
            return
        }
        const { user } = req
        const cartLogin = await cartDAOS.cartUserLoggin(user._id)
        if (!cartLogin) {
            res.status(404).send(`User without cart`)
            return
        }
        const { products } = cartLogin
        
        let template = `<div>`
        products.forEach(product => {
            template += `
                    <div>
                        <div>
                            <label><b>Name:</b> ${product.name}</label> 
                        </div>
                        <div>
                            <label><b>Description:</b> ${product.description}</label> 
                        </div> 
                        <div>
                            <label><b>Code:</b> ${product.code}</label> 
                        </div>
                        <div>
                            <label><b>Price:</b> ${product.price}</label> 
                        </div> 
                        <div>
                            <img src="${product.picture}" alt="MDN" height=150 width=150>
                        </div>
                    </div>
                    <hr>
            `
        })

                
        const from = process.env.ADMIN_EMAIL
        const to = process.env.ADMIN_EMAIL
        const subject = `New Order to ${user.name} - ${user.email}`
        const html = template

        /*Configuracon Envio de Email*/ 
        const options = {
            from,
            to,
            subject,
            html
        }
        
        /*Configuracon Envio de Whatsapp*/ 
        const opt = {
            body : `New Order to ${user.name} - ${user.email}`,
            to : user.phone
        }

        const mail = new NodeMailer(options)
        const message = new Message(opt)

        await mail.send()
        
        message.sendSMS()
        message.sendWhatsapp()

        cartDAOS.user_id(user.user_id)
        res.status(200).json({
            message: `Cart send and deleted`
        })
    }
}

export { CController }