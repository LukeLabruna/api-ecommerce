const { faker } = require("@faker-js/faker")

const categories = ["CPU", "GPU", "PSU", "RAM", "MOTHER"];

const getRandomCategory = () => {
  return categories[Math.floor(Math.random() * categories.length)];
}

const productGenerator = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.urlPicsumPhotos(),
    code: faker.string.uuid(),
    stock: faker.number.int({ min: 0, max: 100 }),
    category: getRandomCategory(),
    status: faker.datatype.boolean(),
  }
}

module.exports = productGenerator