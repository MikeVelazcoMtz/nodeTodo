var express = require('express')
var jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator/check')
const validatorUtil = require('express-validator').utils
const {matchedData, sanitize} = require('express-validator/filter')

var router = express.Router()

module.exports = function (secret) {
  router.get('/home', function (req, res) {
    res.send('<h1>Hello!</h1><p>Welcome to Express.js</p>')
  })

  router.post('/login', function (req, res) {
    // Validate user name
    req.checkBody('username')
      .exists().withMessage('Username is required')
      .notEmpty().withMessage('Username can\'t be empty')
      .isAlphanumeric('es-ES').withMessage('Username format is not valid')
      .isLength({min: 3, max: 50}).withMessage('Username must be between 3 and 50 characters long')
      .matches('example').withMessage('Username must match example')// Just for testing

    req.checkBody('password')
      .isAlphanumeric('es-ES').withMessage('Username format is not valid')
      .isLength({min: 3, max: 50}).withMessage('password must be between 3 and 50 characters long')
      .matches('123').withMessage('Username must match 123') // Just for testing

    var errors = req.validationErrors()

    if (errors) {
      res.send(errors)
    } else {
      username = req.sanitize('username').trim()
      var token = jwt.sign({
        user: username
      }, secret, {
        expiresIn: '1d'
      })

      res.send(token)
    }
  })

  router.get('/protected_url', function (req, res) {
    res.send('Welcome to the protected URL :D!!!')
  })

  return router
}
