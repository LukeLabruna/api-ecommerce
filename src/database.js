const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(`mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@cluster0.ud53fbh.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log("Connected database"))
  .catch((error) => console.error("Error Establishing a Database Connection", error))