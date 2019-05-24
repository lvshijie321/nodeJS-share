const router = require('express').Router()
const find = require('./find')
const edit = require('./edit')
const delete_ = require('./delete')
const add = require('./add')

router.use('/', find)
router.use('/delete', delete_)
router.use('/edit', edit)
router.use('/add', add)

module.exports = router
