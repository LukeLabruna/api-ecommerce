const cards = document.querySelectorAll('.cardCart')
let total = 0

cards.forEach(card => {
  const price = parseInt(card.querySelector(".price").innerHTML)
  const quantity = parseInt(card.querySelector(".quantity").innerHTML)
  const subTotal = card.querySelector(".subTotal")
  subTotal.innerHTML = price * quantity
  total += parseInt(subTotal.innerHTML)
})

document.getElementById("total").innerHTML = `Total: $${total}`