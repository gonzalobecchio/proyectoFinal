import fs from 'fs'
import path from 'path'

const pathP = path.resolve('./Persistence', 'products.txt')

class ProductsFile {

    constructor() {
        this.pathFile = pathP
    }

    generateId = (array) => {
        return array.length == 0 ? 1 : array.length + 1
    }

    /*Return products*/
    allProductsFromFile = async () => {
        try {
            const response = await fs.promises.readFile(this.pathFile, 'utf-8')
            return response ? JSON.parse(response) : []
        } catch (error) {
            console.log(`Error catch: ${error.message} `)
        }
    }

    /**Ejecuta busqueda de un producto */
    findByOne = async (id, products) => {
        const productArray = Object.values(products)
        if (productArray.length) {
            return await productArray.find(product => product.id == id)
        }
        return false
    }

    save = async (product) => {
        try {
            let products = await this.allProductsFromFile()
            if (!products.length) {
                products.push(product)
            } else {
                products = Object.values(products)
                products.push(product)
            }
            fs.promises.writeFile(this.pathFile, JSON.stringify(products))
        } catch (error) {
            console.log(`Error catch: ${error.message}`)
        }
    }

    updateByOne = async (id, product) => {
        try {
            let products = await this.allProductsFromFile()
            // products = Object.values(products)
            const index = products.findIndex(product => product.id == id)
            if (index !== null) {
                products[index] = product
                fs.writeFile(this.pathFile, JSON.stringify(products), (err) => {
                    if (err){
                        console.log(err)
                        return
                    } 
                })
                return product
            }
        } catch (error) {
            console.log(`Error catch: ${error.message}`)
        }
    }
    
    /*Elimina un producto de la lista*/
    deleteByOne = async (id) => {
        try {
            let products = await this.allProductsFromFile()
            const index = products.findIndex(product => product.id == id)
            if (index !== null) {
                const deleted  = products.splice(index, 1)
                fs.writeFile(this.pathFile, JSON.stringify(products), (err) =>{
                    console.error(err)
                    return
                })
                return deleted
            }
        } catch (error) {
            console.log(error.message)
        }
    }

}

export { ProductsFile } 