/**
 * 步骤 1 ：express 路由最基本的用法
 */

const express = require("express");
const app = new express(); // 或者 express()

app.get("/", (req, res) => {
  res.send("<h1>index</h1>");
});

// 动态路由
app.get("/news/:id", (req, res) => {
  res.send(req.params.id);
});

app.get("/product", (req, res) => {
  res.send(req.query.id);
});
app.listen(2000, () =>
  console.log("express-app-step01.js app listening on port 2000!")
);
