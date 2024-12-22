const Account = require("../model/accounts.model")
const Role = require("../model/roles.model")
const systemConfig = require("../config/system")
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }else{
        const user = await Account.findOne({
            token: req.cookies.token
        })
        if(!user){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        }
        res.locals.user = user
        const role = await Role.findOne({
            _id: user.role_id
        })
        res.locals.role = role
        next()
    }
}