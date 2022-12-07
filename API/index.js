import * as dotenv from 'dotenv'
dotenv.config()

/****************************************Dependencias****************************************/ 
import express from 'express'
import session from 'express-session'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url';
import os from 'os'
import cluster from 'cluster'
import minimist from 'minimist'
/****************************************Dependencias****************************************/ 


import  { passport }  from "../Auth/passport.js"
import { product } from '../Routes/product.js'
import { cart } from '../Routes/cart.js'
import { auth } from '../Routes/auth.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace('\\API',"");
const numCPUs =  os.cpus().length

const options = { default: { port: 8081, modo: 'fork' }, alias: { p: 'port', m: 'modo' } }
const args = minimist(process.argv.slice(2), options)

const PORT = args.port ?? process.env.PORT ?? 8081
const MODO = args.modo


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname.replace('\\', '/'), 'public')))
app.use('/uploads', express.static(path.join(__dirname.replace('\\', '/'), 'uploads')))


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(session({
    secret: process.env.MY_SECRET,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 600000
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


app.use('/api', product)
app.use('/api', cart)
app.use('/api', auth)

app.use('*', (req, res) => {
    res.status(404).json(
        {   
            error: '-2', 
            description: req.path,
            method: `${req.method} resource does not exist`
        })
});

if (MODO == 'cluster') {
    if (cluster.isPrimary) {
        console.log(`PID MASTER ${process.pid}`)

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`)
        })
    } else {
        app.listen(PORT, () => { console.log(`Corriendo en Puerto ${PORT}`) })
        console.log(`Worker ${process.pid} started`)
    }
} else {
    app.listen(PORT, () => { console.log(`Corriendo en Puerto ${PORT}`) })
    console.log(`Process ${process.pid} started`)
    
}


// app.listen(process.env.PORT ?? PORT, () => console.log(`Running in PORT ${PORT}`))