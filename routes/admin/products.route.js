const express = require('express')
const router = express.Router()
const controller = require("../../controllers/admin/products.controller")


const uploadCloud = require("../../middleware/uploadCloud.middleware")

const multer  = require('multer')
const upload = multer({})

const validate = require("../../validates/admin/products.validate")

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete/:id', controller.delete)

router.get('/create', controller.create)

router.post('/create',
    upload.single("thumbnail"), 
    uploadCloud.upload, 
    validate.createPost,
    controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id',
    upload.single("thumbnail"), 
    uploadCloud.upload, 
    validate.createPost,
    controller.editPatch
)

router.get('/detail/:id', controller.detail)


module.exports = router