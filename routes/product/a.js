const router = require('express').Router()
router.get('/a1', (req, res) => {
    res.send('product/a/a1')
})

module.exports = router