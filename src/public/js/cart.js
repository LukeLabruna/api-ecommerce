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
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          Swal.fire({
            title: "Good job!",
            text: `${data.message}`,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000
          })
        } else if (data.status === "error") {
          Swal.fire({
            title: "Oops...",
            text: `${data.message}`,
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000
          })
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${e.error}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
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
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          Swal.fire({
            title: "Good job!",
            text: `${data.message}`,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000
          })
          setTimeout(() => {
            location.reload()
          }, 500)
        } else if (data.status === "error") {
          Swal.fire({
            title: "Oops...",
            text: `${data.message}`,
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000
          })
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${e.error}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
        })
      })
  })

  total += updateSubtotal()
})

document.getElementById("total").innerHTML = `Total: $${total}`