const router = require('express').Router()
const md5 = require("md5-node");
const bodyParser = require("body-parser"); // 不能处理图片上传


router.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
router.use(bodyParser.json()); // parse application/json

router.get("/", (req, res) => {
  //req.app.set("views", process.cwd() + '/views/login');
  res.render("login/login");
});

router.post("/do", (req, res) => {
  const param = {
    ...req.body
  };

  param.password = md5(req.body.password);
  req.app.locals.db.find("user", param).then(data => {
    if (data.length) {
      req.app.locals.userInfo = req.session.userInfo = data[0]
      res.redirect('/product')
    } else {
      res.send("<script>alert('登录失败');location.href='/login';</script>")
    }
  });
});

router.get("/out", (req, res) => {
  req.session.cookie.maxAge = 0; // 这么做客户端的 cookie 会清除
  req.session.destroy(function(err) {
    if (!err) {
      res.redirect("/login");
    }
  });
});

module.exports = router