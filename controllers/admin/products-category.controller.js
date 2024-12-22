const ProductsCategory = require("../../model/products-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helper/createTree")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render('admin/page/products-category/index', { 
        title: 'Products',
        records: newRecords
    })
}

// [GET]: /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    res.render("admin/page/products-category/create",{
        pageTitle: "Trang tạo danh mục sản phẩm",
        records: newRecords
    })
}

module.exports.createPost = async (req, res) => {
    console.log(req.body);
    if(req.body.position == ""){
        const countProduct = await ProductsCategory.countDocuments()
        req.body.position = countProduct + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductsCategory(req.body)
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

// [GET]: /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id
    const data = await ProductsCategory.findOne({_id: id, deleted: false})
    // Lấy ra data để gán cho danh mục cha
    const records = await ProductsCategory.find({
        deleted: false,
    })
    const newRecords = createTreeHelper.tree(records)
    // End Lấy ra data để gán cho danh mục cha
    res.render("admin/page/products-category/edit",{
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        data: data,
        records: newRecords
    })
} 


// [PATCH]: /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    
    req.body.position = parseInt(req.body.position)
    
    
    try {
        await ProductsCategory.updateOne({_id: id}, req.body)
    } catch (error) {
        req.flash("error", `Cập nhật thất bại`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
} 

