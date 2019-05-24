const router = require('express').Router()

router.get("/", (req, res) => {
  res.app.locals.db.find("product")
    .then(data => {
      res.render("product/product", { list: data });
    })
    .catch(e => {});
});

module.exports = router