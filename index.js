const express = require('express')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
const app = express()
require('dotenv').config()
const port = process.env.PORT

const moment = require("moment")



app.set('views', './views')
app.set('view engine', 'pug')

app.locals.moment = moment

// flash
var flash = require('express-flash')
const cookieParser = require("cookie-parser")
const session = require("express-session")

app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

// tinymce

var path = require('path');
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// end tinymce

// method
app.use(methodOverride('_method'))
// end

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
// end

const route = require("./routes/client/index.route")
route(app)

const routeAdmin = require("./routes/admin/index.route")
routeAdmin(app)

// Public
app.use(express.static('public'))
// End Public

const database = require("./config/database")
database.connect()

const systemConfig = require("./config/system")
app.locals.prefixAdmin = systemConfig.prefixAdmin



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})