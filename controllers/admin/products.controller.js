const Product = require("../../model/products.model")
const filterStatusHelper = require("../../helper/filterStatus")
const searchHelper = require("../../helper/search")
const systemConfig = require("../../config/system")
const ProductsCategory = require("../../model/products-category.model")
const createTreeHelper = require("../../helper/createTree")
const Account = require("../../model/accounts.model")

module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    // Button Status
    if(req.query.status){
        find.status = req.query.status
    }
    
    const filterStatus = filterStatusHelper(req.query)
    // End

    // Search
    const searchObject = searchHelper(req.query)
    if(searchObject.regex){
        find.title = searchObject.regex
    }
    // End

    // Pagination
    const objectPagination = {
        limitItem: 4,
        pageCurrent: 1,
    }

    if(req.query.page){
        objectPagination.pageCurrent = req.query.page
    }

    objectPagination.skip = objectPagination.limitItem * (objectPagination.pageCurrent - 1)

    const countProducts =  await Product.countDocuments(find)

    objectPagination.totalPage = Math.ceil(countProducts/objectPagination.limitItem)
    
    // End Pagination

    // Sort
    let sort ={};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position = "desc"
    }
    // End Sort

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip).sort(sort)

    // Lấy ra tên người thêm mới products
    for(const product of products){
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountFullname = user.fullname
        }
        const updatedBy = product.updatedBy[product.updatedBy.length - 1]
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullname = userUpdated.fullname
        }
    }
    // End

    
    res.render('admin/page/products/index', { 
        title: 'Products',    
        products: products,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: objectPagination
    })
}

module.exports.changeStatus = async (req, res) => {
    const id = req.params.id
    const status = req.params.status
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    await Product.updateOne({_id:id}, {status: status} ,{
        $push: {updatedBy: updatedBy}
    })
    req.flash("success", "Cập nhật thành công !")
    res.redirect("back")
}

module.exports.changeMulti = async(req,res)=>{
    const type = req.body.type
    const ids = req.body.ids.split(" ")
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: ids}},{status: "active"}, {$push: {updatedBy: updatedBy}})
            req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}},{status: "inactive"}, {$push: {updatedBy: updatedBy}})
            req.flash("success", `Cập nhật thành công ${ids.length} sản phẩm`)
            break;
        case "delete-all":
            await Product.updateMany(
                {_id: {$in: ids}},
                {
                    deleted: true, 
                    // deletedAt: new Date()
                    deletedBy:{
                        account_id: res.locals.user.id,
                        deleteAt: new Date()
                    }
                },{$push: {updatedBy: updatedBy}})
            req.flash("success", `Xoá thành công ${ids.length} sản phẩm`)
            break;
        case "change-position":
            for(const item of ids){
                let[id,position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: {$in: id}},{position: position}, {$push: {updatedBy: updatedBy}})
            }
            break;
    
        default:
            break;
    }
    res.redirect("back")
} 


module.exports.delete = async (req, res) => {
    const id = req.params.id
    await Product.updateOne({_id: id}, {
        deleted: true, 
        deletedBy:{
            account_id: res.locals.user.id,
            deleteAt: new Date()
        }
    })
    req.flash("success", "Cập nhật thành công !")
    res.redirect("back")
}

module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }
    const category = await ProductsCategory.find(find)
    const newCategory = createTreeHelper.tree(category)
    res.render('admin/page/products/create', { 
        title: 'Products',
        category: newCategory
    })
}

// [POST]: /admin/products/create
module.exports.createPost = async (req,res) =>{
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const product = new Product(req.body)
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

module.exports.edit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }
    const category = await ProductsCategory.find({
        deleted: false,
    })
    const newCategory = createTreeHelper.tree(category)

    const products = await Product.findOne(find)
    res.render('admin/page/products/edit', { 
        title: 'Products',
        product: products,
        category: newCategory
    })
}

// [PATCH]: /admin/products/edit/:id
module.exports.editPatch = async (req,res) =>{
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
    if(req.file){
        req.flash("success", `Cập nhật thành công`)
    }
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        }
        await Product.updateOne({_id: id}, {
            ...req.body,
            $push: {updatedBy: updatedBy}
        })
    } catch (error) {
        req.flash("error", `Cập nhật thất bại`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}


module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    }
    const products = await Product.findOne(find)
    res.render('admin/page/products/detail', { 
        title: 'Products',
        product: products
    })
}

