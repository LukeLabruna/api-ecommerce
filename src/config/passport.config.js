const passport = require("passport")
const GitHubStrategy = require("passport-github2")
const jwt = require("passport-jwt")
const UserRepository = require("../repository/userRepository.js")
const CartRepository = require("../repository/cartRepository.js")
const configObj = require("./env.config")
const { createHash } = require('../utils/hashBcrypt.js')
const userRepository = new UserRepository
const cartRepository = new CartRepository
const { SECRET_KEY_TOKEN, CLIENT_ID_GH, CLIENT_SECRET_GH, CALLBACK_URL_GH } = configObj

const JWTStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const initializePassport = () => {
  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: SECRET_KEY_TOKEN,
  }, async (jwt_payload, done) => {
    try {
      const user = await userRepository.readUserByEmail(jwt_payload.user.email)
      if (!user) {
          return done(null, false)
      }
      return done(null, user)
  } catch (error) {
      return done(error)
  }
  }))

  passport.use("loginGithub", new GitHubStrategy({
    clientID: CLIENT_ID_GH,
    clientSecret: CLIENT_SECRET_GH,
    callbackURL: CALLBACK_URL_GH
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userRepository.readUserByEmail(profile._json.email)
      if (!user) {
        const newUser = {
          first_name: profile._json.name.split(" ")[0],
          last_name: profile._json.name.split(" ")[profile._json.name.split(" ").length - 1],
          email: profile._json.email,
          age: 0,
          password: "noPassword",
        }
        const result = await userRepository.createUser(newUser);
        done(null, result);
      } else {
        done(null, user);
      }
    } catch (error) {
      return done(error);
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
  })
}


const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["userToken"]
  }
  return token;
}

module.exports = initializePassport