var express = require('express')
var router = express.Router()
var ListItem = require('../models/listItem')

module.exports = function () {
  router.get('/list', async (req, res) => {
    try {
      var items = await ListItem.where({ author: req.user.id }).find()
    } catch (error) {
      res.status(500).send({ message: 'An error occuried while trying to obtain record: ' + error.message })
    }

    res.send(items)
  })

  router.post('/new', async (req, res) => {
    req.checkBody('description')
      .exists().withMessage('Description is required')
      .notEmpty().withMessage('Description can\'t be empty')
      .isLength({ min: 1, max: 50 }).withMessage('Description must be between 1 and 50 characters long')

    var errors = req.validationErrors()

    if (errors) {
      res.status(400)
      res.send(errors)
    } else {
      var description = req.sanitizeBody('description').escape().trim()
      var Item = new ListItem({author: req.user.id, description: description})

      try {
        await Item.save()
        res.send(Item)
      } catch (error) {
        res.status(500).send(error)
      }
    }
  })

  router.get('/:id', async (req, res) => {
    req.checkParams('id')
      .exists().withMessage('id is required')
      .notEmpty().withMessage('id can\'t be empty')
      .matches(/^[0-9a-fA-F]{24}$/).withMessage('id format is not valid')

    var errors = req.validationErrors()

    if (errors) {
      res.status(400)
      res.send(errors)
    } else {
      var itemId = req.sanitizeParams('id').toString()
      var item = await ListItem.where({ author: req.user.id, _id: itemId }).findOne()

      res.send(item)
    }
  })

  router.patch('/:id', async (req, res) => {
    var objectIdRegexp = new RegExp('^[0-9a-fA-F]{24}$')

    req.checkParams('id')
      .exists().withMessage('id is required')
      .notEmpty().withMessage('id can\'t be empty')
      .matches(objectIdRegexp).withMessage('id format is not valid')

    req.checkBody('description')
      .optional()
      .notEmpty().withMessage('Description can\'t be empty')
      .isLength({ min: 1, max: 50 }).withMessage('Description must be between 1 and 50 characters long')

    req.checkBody('done')
      .optional()
      .isBoolean().withMessage('Done must be a valid boolean')

    var errors = req.validationErrors()

    if (errors) {
      res.status(400)
      res.send(errors)
    } else {
      if (!req.body.hasOwnProperty('description') && !req.body.hasOwnProperty('done')) {
        res.status(400).send({message: 'You must send at least one parameter to change'})
      } else {
        var itemId = req.sanitizeParams('id').toString()

        try {
          var Item = await ListItem.where({ author: req.user.id, _id: itemId }).findOne()
        } catch (error) {
          res.status(500).send({ message: 'An error occuried while trying to obtain record: ' + error.message })
        }

        if (Item === null) {
          res.status(404).send({ message: 'Item does not exist.' })
        } else {
          if (req.body.hasOwnProperty('description')) {
            Item.description = req.sanitizeBody('description').escape().trim()
          }

          if (req.body.hasOwnProperty('done')) {
            Item.done = req.body.done
          }

          try {
            await Item.save()
          } catch (error) {
            res.status(500).send({message: 'An error occuried while trying to update record: ' + error.message})
          }

          res.send(Item)
        }
      }
    }
  })

  router.delete('/:id', async (req, res) => {
    // var objectIdRegexp = new RegExp('^[0-9a-fA-F]{24}$')

    req.checkParams('id')
      .exists().withMessage('id is required')
      .notEmpty().withMessage('id can\'t be empty')
      .matches(/^[0-9a-fA-F]{24}$/).withMessage('id format is not valid')

    var errors = req.validationErrors()

    if (errors) {
      res.status(400)
      res.send(errors)
    } else {
      var itemId = req.sanitizeParams('id').toString()

      try {
        await ListItem.findOneAndRemove({ _id: itemId })

        res.send({ 'message': 'Item deleted successfully' })
      } catch (error) {
        res.status(500).send({ message: 'An error occurried while trying to delete record: ' + error.message })
      }
    }
  })

  return router
}
