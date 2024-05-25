const productGenerator = require("../utils/faker.js")

const readMockingProducts = async (req, res) => {
  try {
    const products = []

    for (let i = 0; i < 100; i++) {
      products.push(productGenerator())
    }

    res.status(200).json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: `${error}`})
  }
}

module.exports = readMockingProducts