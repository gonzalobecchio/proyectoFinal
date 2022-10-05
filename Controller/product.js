// import { ProductsFile } from '../Persistence/ProductsFile.js'
import { productDAOS } from '../DAOs/index.js' 

const PController = {
    findProducts: async (req, res) => {
        // const fileProduct = new ProductsFile()
        // const products = await fileProduct.allProductsFromFile()
        const products = await productDAOS.getAll()
        // console.log(products)
        /*En caso de existir productos*/
        if (products) {
            const { id } = req.params
            if (id) {
                // const product = await fileProduct.findByOne(id, products)
                const product = await productDAOS.findByOne(id)
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
        const products = await productDAOS.getAll()
        const product = {... req.body}
        product._id = products.length === 0 ? 1 : products.length + 1
        productDAOS.save(product)
        res.status(201).send(product)
    },
    updateProducts: async (req, res) => {
        const { id } = req.params
        const { body } = req
        const product  = await productDAOS.findByOne(id)
        console.log(product)
        if (product) {
            const updated  = await productDAOS.uByOne(id, {...product, ...body})
            res.status(200).send(updated)
            return   
        }
        res.status(400).send({message: 'product not found'})
    },
    deleteProduct: async (req, res) => {
        const { id } = req.params
        const product  = await productDAOS.findByOne(id)
        if (product) {
            const d = await productDAOS.dByOne(id)
            res.status(204).send(d)
            return   
        }
        res.status(404).send({message: 'product not found'})        
    }
}

export { PController }