const Product = require("../../model/products.model")

const ProductsCategory = require("../../model/products-category.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    })
    const newProducts = products.map(item=>{
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed()
        return item
    })
    res.render('client/page/products/index', { 
        title: 'Products',
        products: newProducts
    
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted:false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find)
        res.render("client/page/products/detail",{
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        res.redirect(`/products`)
    }
}


module.exports.category = async (req, res) => {
    const category = await ProductsCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })
}