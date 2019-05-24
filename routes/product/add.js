const router = require('express').Router()
const multiparty = require("multiparty");

router.get("/", (req, res) => {
  res.render("product/productadd");
});
 

router.post("/do", (req, res) => {
  const form = new multiparty.Form();
  form.uploadDir = 'upload'
  form.parse(req, function(err, fields, files) {
    req.app.locals.db.insert('product', {
      title: fields.title[0],
      price: Number(fields.price[0]),
      fee: Number(fields.fee[0]),
      pic: files.pic[0].path,
      description: fields.description[0]
    }).then(data => {
      res.redirect('/product')
    })
  });
});




module.exports = router