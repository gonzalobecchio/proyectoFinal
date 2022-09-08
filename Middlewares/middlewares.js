import path from 'path'
import { ProductsFile } from '../Persistence/ProductsFile.js'

const pathP = path.resolve('./Persistence', 'products.txt')



const isAdmin = true

const Middlewares = {
    verifyDatesProduct : async (req, res, next) => {
        const { id } = req.params
        const productsFile = new ProductsFile(pathP)
        const products  = await productsFile.allProductsFromFile()
        const product = await productsFile.findByOne(id, products)
        /**Verificacion de existencia de producto para evaluar las propiedades */
        const productUpdateOrNew = product ? {...product, ...req.body} : req.body
        try {
            const { name, description, code, picture, price, stock } = productUpdateOrNew
            const arrayErr = []
            if (!name) arrayErr.push({'name-field': 'name field empty'})
            if (!description) arrayErr.push({'description-field': 'description field empty'})
            if (!code) arrayErr.push({'code-field': 'code field empty'})
            if (!picture) arrayErr.push({'picture-field': 'picture field empty'})
            if (!price) arrayErr.push({'price-field': 'price field empty'})
            if (isNaN(price)) arrayErr.push({'price-field': `price isn't a number`})
            if (!stock) arrayErr.push({'stock-field': 'stock field empty'})
            if (isNaN(stock)) arrayErr.push({'stock-field': `stock isn't a number`})
            if (!Number.isInteger(stock)) arrayErr-push({'stock-field': `stock isn't a integer`})
    
            if (arrayErr.length) {
                res.send(arrayErr)
                return
            }
            next()
        } catch (error) {
            console.log(`Error Catch: ${error.message}`)
        }
    },
    admin : (req, res, next) => {
        if (!isAdmin) {
            res.status(401).json({error: -1, description: `${req.path}` , method: `${req.method} Unauthorize`})
            return
        }
        next()
    }
}

export { Middlewares } 