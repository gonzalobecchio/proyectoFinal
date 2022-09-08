import { ProductsFile } from '../Persistence/ProductsFile.js'

const PController = {
    findProducts: async (req, res) => {
        const fileProduct = new ProductsFile()
        const products = await fileProduct.allProductsFromFile()
        /*En caso de existir productos*/
        if (products) {
            const { id } = req.params
            if (id) {
                const product = await fileProduct.findByOne(id, products)
                if (product) {
                    res.status(200).send(product)
                    return
                }
                res.status(404).send({ message: 'product not found' })
                return
            }
            res.status(200).send(products)
            return
        }
        res.status(200).json([{ message: 'no products found' }])
    },
    createProducts: async (req, res) => {
        const fileProduct = new ProductsFile()
        const products = await fileProduct.allProductsFromFile()
        const product = {... req.body}
        product.id = products.length === 0 ? 1 : products.length + 1
        product.timestamp = Date.now() 
        fileProduct.save(product)
        res.status(201).send(product)
    },
    updateProducts: async (req, res) => {
        const { id } = req.params
        const { body } = req
        const fileProduct = new ProductsFile()
        const products = await fileProduct.allProductsFromFile()
        /*Cuando el producto no se encuentra informa y corta la secuencia de pasos*/
        const product  = await fileProduct.findByOne(id, products)
        if (product) {
            // const newProduct = {...product, ...body}
            // console.log(product)
            const updated  = await fileProduct.updateByOne(id, {...product, ...body})
            res.status(200).send(updated)
            return   
        }
        res.status(400).send({message: 'product not found'})
    },
    deleteProduct: async (req, res) => {
        const { id } = req.params
        const fileProduct = new ProductsFile()
        const products = await fileProduct.allProductsFromFile()
        const product  = await fileProduct.findByOne(id, products)
        if (product) {
            const d = await fileProduct.deleteByOne(id)
            res.status(204).send(d)
            return   
        }
        res.status(404).send({message: 'product not found'})        
    }
}

export { PController }