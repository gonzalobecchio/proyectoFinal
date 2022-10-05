import admin from 'firebase-admin'

import serviceAccount from "../Persistence/DB_Firebase/proyecto-final-857b9-firebase-adminsdk-fg5vk-cef48c3e17.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    
});

const db =  admin.firestore()

class ContainerFirebase {
    constructor() {
        try {

            this.queryCarts = db.collection('carts')
            this.queryProducts = db.collection('products')

            console.log('Base Firebase conectada')
        } catch (error) {
            console.log(error)
        }

    }

    /***********************Métodos de Carrito****************************/
    getAllCarts = async () => {
        const querySnapshot = await this.queryCarts.get()
        try {
            let docs = querySnapshot.docs;
            const response = docs.map((cart) => ({
                _id: cart._id,
                products: cart.data().products,
            }))
            return response
        } catch (error) {
            console.log(error)
        }
    }

    create = async () => {
        try {
            const carts = await this.getAllCarts()
            const cart = {}
            cart.products = []
            cart.timestamp = Date.now()
            cart._id = carts.length == 0 ?  1 : carts.length + 1
            const cartNew = this.queryCarts.doc(`${cart._id}`)
            await cartNew.create(cart)
            return cart
        } catch (error) {
            console.error(`Error Catched: ${error}`)
        }
    }


    /*find by id*/
    fByid = async (_id) => {
        const doc = this.queryCarts.doc(`${_id}`)
        const cart = await doc.get()
        return cart.data()
    }

    addProduct = async (_id, product, cart) => {
        const { products } = cart
        products.push(product)
        const doc = this.queryCarts.doc(`${_id}`)
        return await doc.update({products})
    }


    /*Elimina Carrito*/
    dByOne = async (_id) => {
        const doc = this.queryCarts.doc(`${_id}`)
        return await doc.delete()
        
    }


   /*Elimina un producto del carrito de compra*/
   dProductFromCart = async (_id, id_prod) => {
    try {
        const cart = await this.fByid(_id)
        const { products } = cart
        
        if (!products) {
            return false
        }
        const indexProduct = products.findIndex(product => product._id == id_prod)
        if (indexProduct == -1) {
            return false
        }

        products.splice(indexProduct, 1)
        const doc = this.queryCarts.doc(`${_id}`)
        await doc.update({products})
        return true
    } catch (error) {
        console.error(`Error Catched in deleteProductFromCart: ${error}`)
    }

}

    /**Lista los productos por carrito seleccionado */
    listProducts = async (_id) => {
        const doc = this.queryCarts.doc(`${_id}`)
        const cart = await doc.get()
        return cart.data()
    }



    /***********************Metodos de Productos****************************/

    generateId = () => { }

    /*Producto*/
    allProductsFromFile = async () => {
        try {
            const querySnapshot = await this.queryProducts.get()
            let docs = querySnapshot.docs;
            const response = docs.map((product) => ({
                _id: product._id,
                name: product.data().name,
                price: product.data().price,
                stock: product.data().stock,
                picture: product.data().picture,
                description: product.data().description,
                code: product.data().code,
            }))
            return response
        } catch (error) {
            console.log(error)
        }
    }

    /*Producto*/ 
    findByOne = async (_id) => {
        try {
            const doc = this.queryProducts.doc(`${_id}`)
            const product =  await doc.get()
            return  product.data()
        } catch (error) {
            console.log(error)
        }
    }

    /*Producto*/ 
    save = async (product) => {
        try {
            console.log(product._id)
            let doc = this.queryProducts.doc(`${product._id}`)
            await doc.create(product)
        } catch (error) {
            console.log(error)
        }
    }

    /*Producto*/
    updateByOne = async (_id, product) => {
        try {
            const productU = this.queryProducts.doc(`${_id}`)
            return await productU.update(product)
        } catch (error) {
            console.log(error)
        }
    }

    /*Producto*/ 
    deleteByOne = async (_id) => {
        try {
            const product = this.queryProducts.doc(`${_id}`)
            return await product.delete()
        } catch (error) {
            console.log(error)
        }
    }

}

export { ContainerFirebase } 