const cid = document.getElementById("cid").innerHTML

const addCartDetail = document.getElementById("addCartDetail")

addCartDetail.addEventListener("click", () => {

  const _id = addCartDetail.getAttribute("data-uid")
  
  fetch(`/api/carts/${cid}/product/${_id}`, {
    method: "POST",
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


