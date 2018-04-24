var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var helmet = require('helmet')
var expressJWT = require('express-jwt')
var validator = require('express-validator')
var statusMiddleware = require('./middlewares/statusPages')
var indexRouter = require('./routes/index')
var mongoose = require('mongoose')

const JWT_SECRET = process.env.SECRET || 'MY_SECRET'

mongoose.connect(process.env.MONGODB_CONNECTION)

var app = express()
app.use(helmet())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(validator())
app.use(expressJWT({secret: JWT_SECRET, expiresIn: '1d'}).unless({path: ['/sign_in', '/login']}))

// routes
app.use('/', indexRouter(JWT_SECRET))

// Custom middlewares
app.use(statusMiddleware['404'])
app.use(statusMiddleware['401'])
app.use(statusMiddleware['500'])

module.exports = app
