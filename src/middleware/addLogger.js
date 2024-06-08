const logger = require("../config/logger.config.js")

const addLogger = (req, res, next) => {
  req.logger = logger
  req.logger.http(
    `${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`
  )
  next()
}

module.exports = addLogger