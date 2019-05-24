const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('admin index')
})
router.get('/product', (req, res) => {
  res.send('admin product')
})

module.exports = router