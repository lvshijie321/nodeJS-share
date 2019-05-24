/**
 * 步骤 3 ：express 路由真正地模块化使用方法
 */
const express = require("express");
const app = express();
const index = require('./routes/index')
const product = require('./routes/product')

app.use('/product', product)
app.use('/', index)

app.listen("2003");
