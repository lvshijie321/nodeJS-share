const router = require('express').Router()

router.get("/:id", (req, res) => {
  req.app.locals.db.deleteOne("product", { _id: new req.app.locals.db.ObjectID(req.params.id) }).then(() => {
    res.redirect("/product");
  });
});


module.exports = router