import { ContainerFirebase }  from '../../Containers/ContainerFirebase.js' 

class ProductsDAOsFirebase extends ContainerFirebase {
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

    async dByOne(_id){
        this.deleteByOne(_id)
    }
}

export default ProductsDAOsFirebase 