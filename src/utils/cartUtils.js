const generateUniqueCode = () => {
  const codeLength = 8
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const randomCharacter = () => characters.charAt(Math.floor(Math.random() * characters.length))
  
  const code = Array.from({ length: codeLength }, randomCharacter).join('')
  const timestamp = Date.now().toString(36)
  
  return `${code}-${timestamp}`
}

const calculateTotal = (products) => {
  return products.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

module.exports = {generateUniqueCode, calculateTotal}