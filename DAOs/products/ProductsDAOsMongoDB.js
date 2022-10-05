import { ContainerMongoDB }  from '../../Containers/ContainerMongoDB.js' 

class ProductsDAOsMongoDB extends ContainerMongoDB {
    constructor(){
        super()
    }

    async getAll(){
        return await this.allProductsFromFile()
    }

    async findByOne(id){
        return await this.findByOne(id)
    }

    async save(product){
        this.save(product)
    }

    async uByOne(_id, product){
        this.updateByOne(_id, product)

    }
}

export default ProductsDAOsMongoDB 