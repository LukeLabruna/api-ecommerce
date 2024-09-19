const mongoose = require("mongoose")
const configObj = require("../config/env.config.js")
const { USER_MONGO, PASSWORD_MONGO, DB_MONGO } = configObj

mongoose.connect(`mongodb+srv://${USER_MONGO}:${PASSWORD_MONGO}@api-e-commerce.whgqq.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority&appName=api-e-commerce`)
                  // mongodb+srv://lucaspablolabruna:<db_password>@api-e-commerce.whgqq.mongodb.net/?retryWrites=true&w=majority&appName=api-e-commerce
  .then(() => console.log("Connected database"))
  .catch((error) => console.error("Error Establishing a Database Connection", error))