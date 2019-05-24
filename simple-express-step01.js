/**
 * 步骤 1 ：模仿 express 实现路由最基本的用法
 *    （1） 将一个函数同时作为构造函数和普通函数使用
 *    （2） 向函数添加属性，以便未来能访问
 *    （3） 基本的路由分发（进阶地完成路由分发功能，express 真正路由分发并不是此章节描述的那样）
 *    （4） 解析路由中的动态参数 
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
