/**
 * 步骤 2 ：模仿 express 实现静态资源托管中间件和 post 请求参数获取中间件
 *    （1）开发一个静态资源托管服务
 *    （2）添加静态资源中间件
 *    （3）添加 post 参数获取中间件
 */

const simpleExpress = require("./libs/simple-express-02");
const app = new simpleExpress();
const ejs = require("ejs");

// 注册静态资源托管中间件
app.use(simpleExpress.static('static')) // 访问 http://127.0.0.1:2001/images/lesson.png 获取图片资源 { baseDir: 'static' }

// 注册获取 post 请求参数中间件
app.use(simpleExpress.bodyParser('formData')) // { type: 'formData' }

app.get("/", (req, res) => {
  res.end('<h1>index</h1>')
});

app.get("/login", (req, res) => {
  ejs.renderFile("views/form.ejs", {}, function(err, str) {
    res.writeHead(200, {
      "Content-Type": "text/html;charset=utf-8"
    });
    res.end(str);
  });
});

app.post("/doLogin", (req, res) => {
  res.end(`<h1>${req.bodyStr}</h1>`)
});

app.listen(1002);
