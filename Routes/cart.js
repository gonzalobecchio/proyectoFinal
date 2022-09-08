import { Router } from 'express'
import { Middlewares } from '../Middlewares/middlewares.js'
import { CController } from '../Controller/cart.js'

const cart = Router()

/**
 * Crear Carrito
*/
cart.post('/cart', Middlewares.admin, CController.createCart)

/**
 * Agregar producto al carrito
 */
cart.post('/cart/:id/products', CController.addProduct)

/**
 * Listar productos del carrito
*/
cart.get('/cart/:id/products', CController.allProductsFromCart)

/**
 * Eliminar producto del carrito
*/
cart.delete('/cart/:id/products/:id_prod', CController.deleteProductFromCart)

/**
 * Eliminar carrito
 */
cart.delete('/cart/:id', Middlewares.admin, CController.emptyCart)

export { cart }
