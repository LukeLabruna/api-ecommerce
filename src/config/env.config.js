const dotenv = require("dotenv")
const program = require("../utils/commander.js")

const { mode } = program.opts()

dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production"
})

const configObj = {
  PORT: process.env.PORT,
  USER_MONGO: process.env.USER_MONGO,
  PASSWORD_MONGO: process.env.PASSWORD_MONGO,
  DB_MONGO: process.env.DB_MONGO,
  CLIENT_ID_GH: process.env.CLIENT_ID_GH,
  CLIENT_SECRET_GH: process.env.CLIENT_SECRET_GH,
  CALLBAK_URL_GH: process.env.CALLBAK_URL_GH,
  SECRET_KEY_TOKEN: process.env.SECRET_KEY_TOKEN,
  ENVIRONMENT: process.env.ENVIRONMENT,
  LOG_LEVEL: process.env.LOG_LEVEL
}

module.exports = configObj