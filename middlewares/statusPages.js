var path = require('path')

module.exports = {
  404: function (req, res, next) {
    res.status(404)

    res.format({
      html: function () {
        res.type('html')
        res.sendFile('404.html', { root: path.join(__dirname, '../', 'public') })
      },
      json: function () {
        res.json({ error: 'Not found' })
      },
      default: function () {
        res.type('txt').send('Not found')
      }
    })
  },

  500: function (err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500)
    console.log(err)
    res.type('html')
    res.sendFile('500.html', { root: path.join(__dirname, '../', 'public') })
  },

  401: function (err, req, res, next) {
    res.status(err.status || 401)
    res.format({
      json: function () {
        res.json({ error: 'Authtentication error' })
      },
      default: function () {
        res.type('txt').send('ERROR: Authtentication error')
      }
    })
  }
}
