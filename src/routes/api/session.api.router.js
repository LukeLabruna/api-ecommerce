const express = require("express")
const router = express.Router()
const passport = require("passport")

router.get("/current", passport.authenticate("jwt", {session:false}), (req, res) => {
  const { user } = req.user
  if (!user) {
    return res.status(404).json({mesagge: "Session not found"})
  }
  res.send(user)
})

module.exports = router