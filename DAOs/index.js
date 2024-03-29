import * as dotenv from 'dotenv'
dotenv.config()

let productDAOS;
let cartDAOS
let authDAOS

switch (process.env.PERSISTENCE) {
    case 'mongodb':
        const  {default: ProductDAOsMongoDB}  = await import('./products/ProductsDAOsMongoDB.js') 
        const  {default: CartsDAOsMongoDB}  = await import('./carts/CartsDAOsMongoDB.js') 
        const  {default: AuthDAOsMongoDB}  = await import('./auth/AuthDAOsMongoDB.js') 
        productDAOS = new ProductDAOsMongoDB()
        cartDAOS = new CartsDAOsMongoDB()
        authDAOS = new AuthDAOsMongoDB()
    break;
    case 'firebase':
        const  {default: CartsDAOsFirebase} = await import('./carts/CartsDAOsFirebase.js') 
        const  {default: ProductDAOsFirebase}  = await import('./products/ProductsDAOsFirebase.js') 
        productDAOS = new ProductDAOsFirebase()
        cartDAOS = new CartsDAOsFirebase()
    break;
}


export { productDAOS, cartDAOS, authDAOS }