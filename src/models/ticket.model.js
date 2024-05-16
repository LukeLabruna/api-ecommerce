const mongoose = require('mongoose');

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

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    products : [productsSchema],
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

ticketSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price thumbnail')
    next()
  })

const TicketModel = mongoose.model('Ticket', ticketSchema)

module.exports = TicketModel