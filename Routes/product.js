import { Router } from 'express'
import { Middlewares } from '../Middlewares/middlewares.js'
import { PController } from '../Controller/product.js'

const product = Router()

/*
 * Busca un/todos producto/s
 **/
product.get('/products/:id?', PController.findProducts)

/** 
 * Crear un producto
*/
product.post('/products', Middlewares.admin, Middlewares.verifyDatesProduct, PController.createProducts)

/**
 * Modifica un producto
 */
product.put('/products/:id', Middlewares.admin, Middlewares.verifyDatesProduct, PController.updateProducts)

/**
 * Elimina un producto
 * */ 
product.delete('/products/:id', Middlewares.admin, PController.deleteProduct)

export  { product } 