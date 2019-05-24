const router = require('express').Router()
const multiparty = require("multiparty");

router.get('/:id', (req, res) => {
  req.app.locals.db.find("product", {_id: new req.app.locals.db.ObjectID(req.params.id)})
    .then(data => {
      res.render("product/productedit", { detail: {
        ...data[0],
        id: req.params.id,
      } });
    })
    .catch(e => {});
})

router.post("/do/:id", (req, res) => {
  const form = new multiparty.Form();
  form.uploadDir = 'upload'
  form.parse(req, function(err, fields, files) {
    req.app.locals.db.updateOne('product', {_id: new req.app.locals.db.ObjectID(req.params.id)}, {$set: { // 使用 _id 查询时，需要转化为 Object 对象
      pic: files.pic[0].path,
      description:fields.description[0],
      fee:fields.fee[0],
      price:fields.price[0],
      title:fields.title[0],
    }}).then(data => {
      res.redirect('/product')
    })
  });
});

module.exports = router