const deleteUserButtons = document.querySelectorAll('.deleteUserButton');
deleteUserButtons.forEach(button => {
  button.addEventListener('click', () => {
    const uid = button.getAttribute('data-uid')
    Swal.fire({
      title: "Are you sure you want to delete this user?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`/api/user/delete/${uid}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
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
                button.closest('.card').remove()
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
        }
      })
    
  })
})

const deleteAllUsers = document.querySelector(".deleteAllUsers")
deleteAllUsers.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure you want to delete all users?",
    showCancelButton: true,
    confirmButtonText: "Delete",
  })
    .then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/user/deleteusersdisconnected`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === "success") {
              const cards = document.querySelectorAll(".card")
              cards.forEach(card => card.remove())
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
      }
    })
  
})