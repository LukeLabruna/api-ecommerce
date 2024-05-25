const productGenerator = require("../utils/faker.js")

const readMockingProducts = async (req, res) => {
  const max = req.query.max || 100

  try {
    const products = []

    for (let i = 0; i < Number(max); i++) {
      products.push(productGenerator())
    }

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({error: `${error.message}`})
  }
}

module.exports = readMockingProducts