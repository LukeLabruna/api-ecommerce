const mongoose = require("mongoose")

const productsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { _id: false })

const cartSchema = new mongoose.Schema({
  products : [productsSchema]
})

cartSchema.pre('findOne', function (next) {
  this.populate('products.product', '_id title price thumbnail')
  next()
})

const CartModel = mongoose.model("carts", cartSchema)

module.exports = CartModel