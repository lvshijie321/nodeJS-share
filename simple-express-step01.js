/**
 * 步骤 1 ：模仿 express 实现路由最基本的用法
 *    （1） 路由分发
 *    （2） 解析路由中的动态参数 
 */

const simpleExpress = require("./libs/simple-express-01");
const app = new simpleExpress(); // 或 simpleExpress()
const ejs = require("ejs");

// 动态路由
app.get("/news/china/:id/:uid", (req, res) => {
  res.end(JSON.stringify(req._params));
});

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
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  });
  res.end(`<h1>${req.body}</h1>`);
});

app.listen(1001);
