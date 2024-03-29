const express = require("express")
const router = express.Router()
const { newProductManager } = require("../api/products.api.router.js")

router.get("/", async (req, res) => {
  const { limit, query, sort, page} = req.query
  const { user } = req.session
  try {
    
    const products = await newProductManager.getProducts(limit, query, sort, page)
    const prevLink = `/products?${query ? `query=${query}&` : ""}${limit ? `limit=${limit}&` : ""}${sort ? `sort=${sort}&` : ""}page=${products.prevPage}`
    const nextLink = `/products?${query ? `query=${query}&` : ""}${limit ? `limit=${limit}&` : ""}${sort ? `sort=${sort}&` : ""}page=${products.nextPage}`
    const status = products.docs.length > 0 ? "success" : "error"

    res.render("home", {
      status,
      payload: products.docs,
      currentPage: products.page,
      totalPages: products.totalPages,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      prevLink,
      nextLink,
      query,
      sort,
      limit,
      user
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
