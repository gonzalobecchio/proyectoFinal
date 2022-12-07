import { ContainerMongoDB }  from '../../Containers/ContainerMongoDB.js'

class CartsDAOsMongoDB extends ContainerMongoDB{
    constructor(){
        super()
    }


    getCarts = async () => {
        this.getAllCarts()
    }

    createCart = async (_id) => {
        return this.create(_id)
    }

    findByid = async (_id) => {
        return await this.fByid(_id)
    }
    
    addProd = async (_id, product, cart) => {
        this.addProduct(_id,product, cart)
    }
    
    /*No funca mas con MongoDB**/
    // updateCart = () => {}
    
    deleteByOne = async (_id) => {
        await this.dByOne(_id)
    }
    
    deleteProductFromCart = async (_id, id_prod) => {
        return await this.dProductFromCart(_id, id_prod)
    }
    
    
    listProductsByCart = async (_id) => {
        return await this.listProducts(_id)
    }

    cartUserLoggin = async ( _id ) => {
        return await this.fByUserLogin(_id)
    }

    cartDeleteByUserLog = async (user_id) => {
        return await this.dByUserLogin(user_id)
    }

}

export default CartsDAOsMongoDB