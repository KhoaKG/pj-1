
const Product = require("../../model/products.model")
const productHelper = require("../../helper/product")
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  })
  const newProductsFeatured = productHelper.priceNewProducts(productsFeatured)

  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).limit(6).sort({position: "desc" })

  res.render('client/page/home/index', { 
    title: 'Hey',
    productsFeatured: newProductsFeatured,
    productsNew: productsNew
  })
}