const socket = io()

const chatBox = document.getElementById("chatBox")
const log = document.getElementById("messagesLogs")
log.scrollTop = log.scrollHeight
let user = document.getElementById("userName").innerHTML

chatBox.addEventListener("keyup", (e) => {
  if(e.key === "Enter") {
      if(chatBox.value.trim().length > 0) {
          socket.emit("message", {user: user, message: chatBox.value})
          chatBox.value = ""
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