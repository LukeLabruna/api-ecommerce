const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
require("dotenv").config()

const mainSession = (app) => {
  app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@cluster0.ud53fbh.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority&appName=Cluster0`,
      ttl: 24 * 60 * 60
    })
  }))
}

module.exports = mainSession