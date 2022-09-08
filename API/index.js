import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { product } from '../Routes/product.js'
import { cart } from '../Routes/cart.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 8080

app.use('/api', product)
app.use('/api', cart)

app.use('*', (req, res) => {
    res.status(404).json(
        {   
            error: '-2', 
            description: req.path,
            method: `${req.method} resource does not exist`
        })
});

app.listen(process.env.PORT ?? PORT, () => console.log(`Running in PORT ${PORT}`))