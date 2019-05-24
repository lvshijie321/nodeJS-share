/**
 * 步骤 0 ：为模仿 express 框架先做一些铺垫，了解一些原生 nodeJS 服务端开发的知识
 *    （1）get 和 post 请求获取参数的方式
 *    （2）响应类型 - Content-Type
 *    （3）url 内置模块
 */

const http = require("http");
const url = require("url");
const ejs = require("ejs");

// 创建服务
http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": 'text/html;charset="utf-8"' }); // 文件类型 html，字符集 utf-8，需要和编辑器左下角的编码相同
    // res.writeHead 需要写在 res.write() 之前，否则会报错：Provisional headers are shown

    // 端口号大于 1000 （预估的值，1000不会发起 /favicon.ico ）浏览器请求服务后（localhost:1001）会接收到 2 次请求，另一次是 /favicon.ico
    const pathname = url.parse(req.url).pathname; // http://127.0.0.1:8000/news?a=1 => /news
    if (pathname === "/favicon.ico") {
      // 过滤 favicon.ico
      res.write("favicon.ico");
    } else if (pathname === "/") {
      res.write("你好，");
      res.write("nodeJS！");
      res.end();
    } else if (pathname === "/news") { // 获取 get 请求方式参数
      const query = url.parse(req.url, true).query;
      res.write(JSON.stringify(query));
      res.end();
    } else if (pathname === "/login") {
      ejs.renderFile("views/form.ejs", {}, (err, str) => {
        res.end(str);
      });
      res.end();
    } else if (pathname === "/doLogin" && req.method.toLowerCase() === "post") { // post 取值的方法
      let postStr = "";
      req.on("data", chunk => {
        postStr += chunk.toString(); // username=zhangsan&password=111
      });
      req.on("end", () => {
        res.end(`<script>alert('${postStr}');</script>`);
      });
    }
    //res.end() // 如果不加结束响应语句，标签页一直转圈，且第二次 favicon.ico 不会请求
    // res.write('。。。'); res.end() 可以写成 res.end('。。。')
  }).listen(8000, "127.0.0.1"); //  可填写 '127.0.0.1' 或 '192.168.100.137' ，也可省略，如果填写，前台必须由填写项发起请求，如：这里配置 127.0.0.1， 前台需要由 127.0.0.1 发起，
// 不可以由 192.168.100.137 发起，报错：Provisional headers are shown，如果省略 localhost '127.0.0.1' 或 '192.168.100.137' 都可发起
