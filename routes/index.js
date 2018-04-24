var express = require('express')
var jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator/check')
const validatorUtil = require('express-validator').utils
const {matchedData, sanitize} = require('express-validator/filter')
const User = require('../models/user')

var router = express.Router()

module.exports = function (secret) {
  router.get('/sign_in', function (req, res) {
    // Validate user name
    req.checkBody('username')
      .exists().withMessage('Username is required')
      .notEmpty().withMessage('Username can\'t be empty')
      .isAlphanumeric('es-ES').withMessage('Username format is not valid')
      .isLength({min: 3, max: 50}).withMessage('Username must be between 3 and 50 characters long')

    req.checkBody('password')
      .isAlphanumeric('es-ES').withMessage('Username format is not valid')
      .isLength({min: 3, max: 50}).withMessage('password must be between 3 and 50 characters long')
    req.checkBody('password_confirmation')
      .isAlphanumeric('es-ES').withMessage('passowrd format is not valid')
      .isLength({min: 3, max: 50}).withMessage('password must be between 3 and 50 characters long')

    var errors = req.validationErrors()

    if (errors) {
      res.status(400)
      res.send(errors)
    } else {
      username = req.sanitize('username').trim()
      password = req.sanitize('password')
      confirm = req.sanitize('password_confirmation')

      if (password != confirm) {
        res.status(400)
        res.send({message: 'password and password_confirmation must be equals'})
      }
    }
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
      res.status(400)
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
