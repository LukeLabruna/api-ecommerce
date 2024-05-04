const express = require("express")
const exphbs = require("express-handlebars")
const io = require("./utils/sockets.js")
require("./utils/database.js")
const mainRoutes = require("./routes/main.router.js")
const cookieParser = require("cookie-parser");
require("dotenv").config()

const passport = require("passport")
const initializePassport = require("./config/passport.config.js")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('*/css', express.static('src/public/css'))
app.use('*/js', express.static('src/public/js'))

app.engine("handlebars", exphbs.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use(cookieParser())

app.use(passport.initialize())
initializePassport()

mainRoutes(app)

const httpServer = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

io(httpServer)

