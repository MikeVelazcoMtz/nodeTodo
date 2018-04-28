var express = require('express')
var jwt = require('jsonwebtoken')
const User = require('../models/user')
var PassowrdUtil = require('../util/password')

var router = express.Router()

module.exports = function (secret) {
  router.post('/sign_in', async function (req, res) {
    // Validate user name
    req.checkBody('username')
      .exists().withMessage('Username is required')
      .notEmpty().withMessage('Username can\'t be empty')
      .isLength({min: 3, max: 50}).withMessage('Username must be between 3 and 50 characters long')

    req.checkBody('password')
      .exists().withMessage('Password is required')
      .notEmpty().withMessage('Password can\'t be empty')
      .isLength({min: 3, max: 50}).withMessage('Password must be between 3 and 50 characters long')

    req.checkBody('password_confirmation')
      .exists().withMessage('Password confirmation is required')
      .notEmpty().withMessage('Password confirmation can\'t be empty')
      .isLength({min: 3, max: 50}).withMessage('Password confirmation must be between 3 and 50 characters long')

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
        user: username,
        id: user._id
      }, secret, {
        expiresIn: '1d'
      })

      res.status(201)
      res.send({message: 'User created successfully', token: token})
    } catch (err) {
      if (err.code === 11000) {
        res.status(409).send({message: 'User already exists.'})
      }

      res.status(500).send(err)
    }
  })

  router.post('/login', async function (req, res) {
    // Validate user name
    req.checkBody('username')
      .exists().withMessage('Username is required')
      .notEmpty().withMessage('Username can\'t be empty')
      .isLength({min: 3, max: 50}).withMessage('Username must be between 3 and 50 characters long')

    req.checkBody('password')
      .exists().withMessage('Password is required')
      .notEmpty().withMessage('Password can\'t be empty')
      .isLength({min: 3, max: 50}).withMessage('Password must be between 3 and 50 characters long')

    var errors = req.validationErrors()

    if (errors) {
      res.status(400)
      res.send(errors)
    } else {
      var username = req.sanitize('username').trim()
      var password = req.sanitize('password').toString()

      try {
        var user = await User.findOne({userName: username})
      } catch (err) {
        res.status(500).send({message: 'Ocurred an error while trying to get user: ' + err.message})
      }

      if (user === null) {
        res.status(400).send({message: `User ${username} does not exist`})
      } else {
        try {
          if (!PassowrdUtil.compare(password, user.password)) {
            res.status(400).send({ message: 'Your password is incorrect' })
          }
        } catch (err) {
          res.status(500).send({ message: 'Ocurred an error while trying to validete password: ' + err.message })
        }
      }

      var token = jwt.sign({
        user: username,
        id: user._id
      }, secret, {
        expiresIn: '1d'
      })

      res.send({token: token, user: user._id, userName: user.userName})
    }
  })

  return router
}
