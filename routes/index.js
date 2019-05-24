const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('index index')
})
router.get('/product', (req, res) => {
  res.send('index product')
})

module.exports = router