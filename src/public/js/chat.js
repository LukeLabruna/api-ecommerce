const socket = io()

const chatBox = document.getElementById("chatBox")
const log = document.getElementById("messagesLogs")
log.scrollTop = log.scrollHeight
let user = sessionStorage.getItem("user") || ""

if (!user) {
  Swal.fire({
    title: "Auth", 
    input: "text",
    text: "Insert username", 
    inputValidator: (value) => {
        return !value && "Username required"
    }, 
    allowOutsideClick: false,
  }).then( result => {
    user = result.value
    user = user.charAt(0).toUpperCase() + user.slice(1)
    sessionStorage.setItem("user", user)
  })
}

chatBox.addEventListener("keyup", (e) => {
  if(e.key === "Enter") {
      if(chatBox.value.trim().length > 0) {
          socket.emit("message", {user: user, message: chatBox.value}); 
          chatBox.value = "";
      }
  }
})

socket.on("message", data => {
  log.innerHTML = ""
  data.forEach( message => {
      let userMessage = document.createElement("div")
      userMessage.innerHTML = `
      <h4>${message.user}:</h4>
      <p>${message.message}</p>`
      log.appendChild(userMessage)
  })
  log.scrollTop = log.scrollHeight
})