// import { CartsFile } from '../Persistence/CartsFile.js'
// import { ProductsFile } from '../Persistence/ProductsFile.js'

import { authDAOS, productDAOS } from '../DAOs/index.js'
import NodeMailer from '../Emails/NodeMailer.js'
import Logger from '../Log/Logger.js'

const loggerAuth = new Logger({level:'info'}) 
const logInfo = loggerAuth.getLogger()
const logError = loggerAuth.getLogger('/error.log')

const AController = {
    //En caso de utilizar las vistas
    getViewLogin: (req, res) => {
        if (!req.isAuthenticated()) {
            res.render('login')
            return
        }
        res.render(`home`)
    },
    login: async (req, res) => {
        const { user } = req
        if (!user) {
            logInfo.warn(`User not found`)
            res.status(404).send(`User not found`)
            return
        }
        res.status(200).send(user)
    },
    //En caso de utilizar las vistas
    getViewRegister: (req, res) => {
        res.render('register')
    },
    register: async (req, res) => {
        const { user } = req
        const from = process.env.ADMIN_EMAIL
        const to = process.env.ADMIN_EMAIL
        const subject = "New User Register"
        const html = `  <div style="background-color: #eee">
        <div>
        <h4>New User Dates</h4>  
    </div>
    <div>
        <label>Email: </label> <span><b>${user.email}</b></span>
    <div>
    <div> 
        <label>Name: </label> <span><b>${user.name}<</b>/span>
    </div>
    <div>    
        <label>Address: </label> <span><b>${user.address}</b></span>
    </div>
    <div>    
        <label>Age: </label> <span><b>${user.age}</b></span>
    </div>
    <div>    
        <label>Phone: </label> <span><b>${user.phone}</b></span>
    </div>
                        </div>    
                         `
        const options = {
            from,
            to,
            subject,
            html
        }
        const mail = new NodeMailer(options)
        await mail.send()
        res.status(201).send(user)
    },
    profile: (req, res) => {
        if (!req.isAuthenticated()) {
            logInfo.info(`Unauthorized request`)
            res.status(401).send({ message: `Unauthorized` })
            return
        }
        res.status(200).json(req.user)
    },
    logout: (req, res) => {
        req.logout(err => {
            if (err) logError.error(err)
            res.status(200).send({ message: `logout` })
        })
    }
}

export { AController }