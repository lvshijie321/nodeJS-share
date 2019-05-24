/**
 * 步骤 2 ：express 静态资源托管中间件的应用
 */

const express = require("express");
const app = new express();

// 注册静态资源托管
app.use(express.static('static'))  // 提供静态服务，不注册无法访问 /css/index.css 这样的静态资源 
app.use(express.static('other')) // 可以提供多个静态资源路径，首先在 static 下找，找不到再到 other 下找，依旧找不到，最后查找注册的路由
// 访问 http://127.0.0.1:2001/images/lesson.png 获取图片资源

app.get("/", (req, res) => {
  res.send("<h1>index</h1>");
});

app.listen(2002);
