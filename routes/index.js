var express = require('express')
var jwt = require('jsonwebtoken')
const User = require('../models/user')

var router = express.Router()

module.exports = function (secret) {
  router.post('/sign_in', async function (req, res) {
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
    }

    // get sanitized data from request
    var username = req.sanitize('username').trim()
    var password = req.sanitize('password').toString()
    var confirm = req.sanitize('password_confirmation').toString()

    if (password !== confirm) {
      res.status(400)
      res.send({message: 'password and password_confirmation must be equals'})
    }

    var user = new User({
      userName: username,
      password: password
    })

    try {
      await user.save()

      var token = jwt.sign({
        user: username
      }, secret, {
        expiresIn: '1d'
      })

      res.status(201)
      res.send({message: 'User created successfully', token: token})
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).send(new Error('Duplicate Record', [err.message]))
      }

      res.status(500).send(err)
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
      var username = req.sanitize('username').trim()
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
