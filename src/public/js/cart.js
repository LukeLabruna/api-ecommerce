const cards = document.querySelectorAll('.cardCart')
let total = 0
const cid = "65fb791d402eeb46629002ea"

cards.forEach(card => {
  const price = parseInt(card.querySelector(".price").innerHTML)
  const quantity = card.querySelector(".quantity")
  // const quantityValue = quantity.value
  const subTotal = card.querySelector(".subTotal")
  const dlt = card.querySelector(".delete")
  const _id = card.id

  const updateSubtotal = () => {
    const quantityValue = parseInt(quantity.value);
    const subtotalValue = price * quantityValue;
    subTotal.innerHTML = subtotalValue;
    return subtotalValue;
  }

  quantity.addEventListener("change", () => {
    const subtotalValue = updateSubtotal();
    total = [...cards].reduce((acc, card) => acc + parseInt(card.querySelector(".subTotal").innerHTML), 0);
    document.getElementById("total").innerHTML = `Total: $${total}`;

    fetch(`/api/carts/${cid}/product/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: parseInt(quantity.value)
      })
    })
  })

  dlt.addEventListener("click", () => {
    fetch(`/api/carts/${cid}/product/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    
    setTimeout(() => {
      location.reload()
    }, 500)
  })

  total += updateSubtotal()
})

document.getElementById("total").innerHTML = `Total: $${total}`