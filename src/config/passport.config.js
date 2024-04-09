const passport = require("passport")
const LocalStrategy = require('passport-local')
const UserModel = require("../models/user.model")
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js")
const GitHubStrategy = require("passport-github2")

const initializePassport = () => {

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email })
            if (user) return done(null, false)
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            done(null, result)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({email})

            if (!user) return done(null, false)
            
            if (!isValidPassword(password, user)) return done(null, false)
            
            done(null, user)   
        } catch (error) {
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

module.exports = initializePassport