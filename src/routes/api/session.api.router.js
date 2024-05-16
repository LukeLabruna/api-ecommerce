const express = require("express")
const router = express.Router()

router.get("/current", (req, res) => {
  const { user } = req.user
  if (!user) {
    return res.status(404).json({mesagge: "Session not found"})
  }
  res.send(user)
})

module.exports = router