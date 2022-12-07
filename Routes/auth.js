import { Router } from 'express'
import { Middlewares } from '../Middlewares/middlewares.js'
import { AController } from '../Controller/auth.js'
import { passport } from "../Auth/passport.js"
import multer from 'multer'

// const log = loggerAuth.getLogger('/info.log')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[1])
  }
})

const upload = multer({ storage: storage })

const auth = Router()

auth.get('/login', AController.getViewLogin)

auth.post('/login', passport.authenticate('login'), AController.login)

auth.get('/register', AController.getViewRegister)

auth.post('/register', upload.single('file'), passport.authenticate('register'), AController.register)

auth.get('/profile', AController.profile)

auth.get('/logout', AController.logout)

export { auth }
