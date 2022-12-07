import passport from 'passport'
import LocalStrategy from 'passport-local'
import bcrypt from "bcrypt";
import { User } from "../ModelsMongo/user.js";

passport.use('login', new LocalStrategy({
    usernameField: 'email'
},
    async (email, password, done) => {
        const userFound = await User.findOne({ email }).lean().exec()
        if (!userFound) {
            console.log(`User not found ${email}`)
            return done(null, false)
        }

        const isMatch = await bcrypt.compare(password, userFound.password)
        // console.log(isMatch)

        if (!isMatch) {
            console.log('Invalid Password!')
            return done(null, false)
        }

        return done(null, userFound)
    }
))


passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    const { name, address, age, phone } = req.body
    const file = !req.file ? null : req.file.filename
    const extFile = !req.file ? null : req.file.originalname.split('.')[1]

    if (!email || !password || !name || !address || !age || !phone) {
        return done(null, false, {message: `Incomplete data`})
    }
    const userFound = await User.findOne({ email }).exec()
    if (userFound) {
        console.log(`Usuario ${userFound.email} already exists`)
        return done(null, false)
    }

    try {
        const users = await User.find({})
        // console.log(users)
        const _id  = users.length == 0 ? 1 : users.length + 1
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        const newUser = new User({ 
            _id,
            email, 
            password: hash,
            name,
            address,
            age,
            phone,
         })
        newUser.save()
        console.log('User created succeful')
        return done(null, newUser)
    } catch (error) {
        console.log(error)
    }
}
))

passport.serializeUser(function (userFound, done) {
    done(null, userFound._id);
});

passport.deserializeUser(async function (_id, done) {
    const user = await User.findById(_id)
    done(null, user);
});


export { passport }