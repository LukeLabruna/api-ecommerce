const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://lucaspablolabruna:coderhouse@cluster0.ud53fbh.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected database"))
  .catch((error) => console.error("Error Establishing a Database Connection", error))