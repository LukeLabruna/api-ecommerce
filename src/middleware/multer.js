const multer = require("multer")
const fs = require("fs").promises

const destinationFolders = {
  profile: "./src/uploads/profiles",
  products: "./src/uploads/products",
  document: "./src/uploads/documents"
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destinationFolder = destinationFolders[file.fieldname] || destinationFolders["document"]

    try {
      await fs.access(destinationFolder)
    } catch (error) {
      await fs.mkdir(destinationFolder, { recursive: true })
    }

    cb(null, destinationFolder)
  },
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split(".").pop()
    const fileName = `${file.originalname.split(".").slice(0, -1).join(".")}-${req.user._id}.${fileExt}`
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })

module.exports = upload