const dashboardRoute = require("./dashboard.route")
const productsRoute = require("./products.route")
const productsCategoryRoute = require("./products-category.route")
const rolesRoute = require("./roles.route")
const systemConfig = require("../../config/system")
const accountsRoute = require("./accounts.route")
const authLogin = require("./auth.route")
const authMiddleware = require("../../middleware/auth.middleware")
module.exports = (app)=>{
    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoute)

    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productsRoute)

    app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productsCategoryRoute)

    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, rolesRoute)

    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountsRoute)

    app.use(PATH_ADMIN + "/auth", authLogin)
}