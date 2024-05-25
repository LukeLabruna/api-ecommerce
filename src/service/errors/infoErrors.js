const generateFieldProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    - title         : Needs to be a String, received ${product.title}
    - description   : Needs to be a String, received ${product.description}
    - price         : Needs to be a Number, received ${product.price}
    - code          : Needs to be a String, received ${product.code}
    - stock         : Needs to be a Number, received ${product.stock}
    - category      : Needs to be a String, received ${product.category}`;
}

const generateInvalidId = (id) => {
  return `ID: ${id} is not valid.
    List of requiered for ID:
    - Length        : 24 character hexadecimal string.
    - Format        : It must consist of characters ranging from 0 to 9 and from "a" to "f".`;
}

const generateNotFoundProductErrorInfo = () => {
  return `Not found Product.
    - Verify in your database that the product exists.`;
}

const generateInvalidCodeProductErrorInfo = (code) => {
  return `Code: ${code} already exists
    - Choose another code.`;
}


const generateNotFoundCartErrorInfo = () => {
  return `Not found Cart.
    - Verify in your database that the cart exists.`;
}

module.exports = {
  generateFieldProductErrorInfo,
  generateInvalidId,
  generateNotFoundProductErrorInfo,
  generateInvalidCodeProductErrorInfo,
  generateNotFoundCartErrorInfo
}