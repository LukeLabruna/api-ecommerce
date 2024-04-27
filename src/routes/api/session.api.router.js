const express = require("express")
const router = express.Router()

router.get("/current", (req, res) => {
  const { login, user } = req.session
  console.log(req.session)
  if (!login) {
    return res.status(404).json({mesagge: "Session not found"})
  }
  res.send(user)
})

module.exports = router