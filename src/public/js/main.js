const socket = io()

const formNewProduct = document.getElementById("formNewProduct")
const formDeleteProduct = document.getElementById("formDeleteProduct")

formNewProduct.addEventListener("submit", (e) => {
  e.preventDefault()

  let title = document.getElementById("title").value
  let description = document.getElementById("description").value
  let price = parseInt(document.getElementById("price").value)
  let thumbnail = document.getElementById("thumbnail").value
  let code = document.getElementById("code").value
  let stock = document.getElementById("stock").value
  let category = document.getElementById("category").value

  const newProduct = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category
  }

  socket.emit("newProduct", newProduct)

  formNewProduct.reset()

})

formDeleteProduct.addEventListener("submit", (e) => {
  e.preventDefault()
  let id = document.getElementById("id").value
  socket.emit("deleteProduct", id)
  formDeleteProduct.reset()
})

socket.on("products", (data) => {
  const realTimeProducts = document.getElementById("realTimeProducts")
  realTimeProducts.innerHTML = ""
  data.forEach(prod => { 
    let card = document.createElement("div")

    card.className = "card"

    const images = prod.thumbnail && prod.thumbnail.length > 0
    ? prod.thumbnail.map(imgSrc => `<img src="${imgSrc}" alt="${prod.title}">`).join('')
    : '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLhZ20NCp7B8aXMv9r7CVxomuhhoPVyT3AcJceeVqmoASVe4m8U6d-mgd0YJWQqfbdfOU&usqp=CAU" alt="No Image">'

    card.innerHTML = `
      <div class="images" >
        ${images}
      </div>
      <h3>${prod.title}</h3>
      <p>Category: ${prod.category} </p>
      <p>Price: $${prod.price}</p>
      <p>Description: ${prod.description} </p>
    `
    realTimeProducts.appendChild(card)
  })
})

socket.on("error", (data) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: `${data}`
  })
})

socket.on("success", (data) => {
  Swal.fire({
    title: "Good job!",
    text: `${data.message}`,
    icon: "success"
  })
})
