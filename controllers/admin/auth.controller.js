const Account = require("../../model/accounts.model")
const md5 = require('md5');
const systemConfig = require("../../config/system")
// [GET]: /admin/auth/login
// [GET]: /admin/auth/login
module.exports.login = async (req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }else{
        res.render("admin/page/auth/login",{
            pageTitle: "Trang login admin"
        })
    }  
}


module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await Account.findOne({
        email : email,
        deleted: false
    })

    if(!user){
        req.flash("error", "email ko tồn tại")
        res.redirect("back")
        return
    }

    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu !")
        res.redirect("back")
        return
    }

    if(user.status == "inactive"){
        req.flash("error", "Tài khoản đã bị khoá !")
        res.redirect("back")
        return
    }

    res.cookie("token", user.token)

    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)

}

module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.redirect("back")
}

