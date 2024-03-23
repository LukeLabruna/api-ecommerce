const express = require("express")
const exphbs = require("express-handlebars")
const io = require("./sockets.js")
require("./database.js")
const mainRoutes = require("./routes/main.routes.js")

const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('*/css',express.static('src/public/css'));
app.use('*/js',express.static('src/public/js'))


app.engine("handlebars", exphbs.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

mainRoutes(app)

const httpServer = app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

io(httpServer)

