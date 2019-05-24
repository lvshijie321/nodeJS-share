const router = require('express').Router()
const a = require('./product/a')
const b = require('./product/b')

router.use('/a', a)

router.use('/b', b)

module.exports = router