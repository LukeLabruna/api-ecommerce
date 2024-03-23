const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  thumbnail: {
    type: [String]
  },
  stock: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model("products", productSchema)

module.exports = ProductModel