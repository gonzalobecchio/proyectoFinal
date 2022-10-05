import fs from  'fs'
import path from 'path'

const pathC = path.resolve('./Persistence', 'carts.txt')

class CartsFile {
    constructor(){
        this.pathFile = pathC
    }

    getAllCarts = async () => {
        const response = await fs.promises.readFile(this.pathFile, 'utf-8')
        return response ? JSON.parse(response) : []
    }

    createCart = async (carts) => {
        try {
            const cartsArray = Object.values(carts) 
            const cart = {}
            cartsArray.length == 0 ? cart.id = 1 : cart.id = cartsArray.length + 1
            cart.timestamp = Date.now()
            cart.products = []
            cartsArray.push(cart)
            console.log(carts)
            await fs.promises.writeFile(this.pathFile, JSON.stringify(cartsArray))
            return cart
        } catch (error) {
            console.error(`Error Catched: ${error}`)
        }
    }

    /**Return carrito por id */
    findByid = async (id, carts) => {
        return carts.find(cart => cart.id == id)
    }

    addProduct = async (id, product, cart) => {
        const { products } = cart
        // console.log(products)
        products.push(product)
        cart.products = products
        console.log(cart)
        return cart
    }

    updateCart = async (id, cart, carts) => {
        try {
            const index = carts.findIndex(cart => cart.id == id)
            if (index !== null ) {
                carts[index] = cart
                await fs.promises.writeFile(this.pathFile, JSON.stringify(carts))
            }
        } catch (error) {
            console.log(`Error catch: ${error}`)
        }
    }

    /**Elimina un carrito */
    deleteByOne  = async (id, carts) => {
        try {
            const index = carts.findIndex(cart => cart.id == id)
            if (index == -1) {
                return false
            }
            carts.splice(index, 1)
            await fs.promises.writeFile(this.pathFile, JSON.stringify(carts))
            return true
        } catch (error) {
            console.log(`Error catch in deleteByOne ${error}`)
        }
    }

    /*Elimina un producto del carrito de compra*/
    deleteProductFromCart = async (id_prod, products, id, carts) => {
        try {
            const indexProduct = Object.values(products).findIndex(product => product.id == id_prod)
            console.log("Index product", indexProduct)
            if (indexProduct == -1) {
                return false
            }
            /**Eliminacion de producto en el carro */
            products.splice(indexProduct, 1)
            
            /**Buscamos indice de carrito a actualizar */
            const indexCart = carts.findIndex(cart => cart.id == id)
            console.log("Index cart", indexCart)
            if (indexCart == -1) {
                return false
            }

            /**Insertamos el carrito actualizado a lista de carritos */
            carts[indexCart].products = products
            await fs.promises.writeFile(this.pathFile, JSON.stringify(carts))
            return true
        } catch (error) {
            console.error(`Error Catched in deleteProductFromCart: ${error}`)
        }

    }

    /**Lista los productos por carrito seleccionado */
    listProductsByCart  = async (id, carts) => {
        const index = carts.findIndex(cart => cart.id == id)
        if (index == -1) {
            return false
        }
        return carts[index].products
    }


}

export { CartsFile }