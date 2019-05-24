const url = require("url");
const http = require("http");
const fs = require('fs');
const mime = require("./getmime");
const events = require("events");
const emitter = new events.EventEmitter();
const path = require('path')

const methods = [
    "get", 
    "post",
]
const routes = {
    "/404": (req, res) => {
        res.writeHead(200, {
        "Content-Type": "text/html;charset=utf-8"
        });

        res.end("<h1>404</h1>");
    },
    get: {
        "/favicon.ico": {
            params: [],
            callback: (req, res) => {
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8"
        });
        res.end();
            }
        }
    },
    post: {},
};

/**
 * 解析动态路由
 */
const matchDynRoute = route => {
    const chunks = route.split('/').slice(1)
    return chunks.reduce((acc, item) => {
        !item.match(':')
            ? (acc.route += `/${item}`)
            : acc.params.push(item.slice(1))
        return acc
    }, {
        route: '',
        params: []
    })
}

/**
 * 处理静态资源
 */
const handleStatic = (method, req) => {
    if (method === 'get' && Staticer.assetsList && Staticer.assetsList.length) {
        return new Promise ((resolve, reject) => {
            const pathName = url.parse(req.url).pathname
            
            console.log(path.resolve(__dirname, `../${Staticer.assetsList[0].baseDir + pathName}`))
            fs.readFile(path.resolve(__dirname,`../${Staticer.assetsList[0].baseDir + pathName}`), 'binary', (err, data) => {
                err ? reject() : resolve(data)
            })
        })
        
        // const todoList = Staticer.assetsList.map(item => {
        //     return (resolve, reject) => {
        //         debugger
        //         console.log(`./${item.baseDir + pathName}`)
        //         fs.stat(`./${item.baseDir + pathName}`, (err, stats) => {
        //             if (!err) {
        //                 resolve(stats)
        //             }
        //         })
        //     }
        // })
        // todoList.reduce((acc, item) => {
        //     return acc.then(() => new Promise((resolve, reject) => item(resolve, reject))).catch(e=> {
                
        //     })
        // }, Promise.reject())
        
        
        
    } else {
        return Promise.reject()
    }
}

/**
 * 静态资源对象
 */
class Staticer {
    constructor(dir) {
        this.baseDir = dir
    }
}

/**
 * post 请求参数解析对象
 */
class BodyParser {
    constructor(type) {
        this.type = type
    }
}

module.exports = SimpleExpress

/**
 * 即作为构造函数（new Func()），也作为普通函数（Func()）使用
 *
 * function Func () {
 *    this.filed = 'filed'
 *    return 'filed' // 基本类型
 * }
 *
 * function Person () {
 *    this.name = '张三'
 *    return { // 普通类型
 *        name: '张三',
 *        age: 22,
 *    }
 * }
 */
function SimpleExpress() {
    const server = http.createServer((req, res) => {
        // 解析method：get 或 post
        const method = req.method.toLowerCase();
        
        // 获取 post 请求参数
        Staticer.bodyParser.forEach(item => {
            switch (item.type) {
                case 'formData':
                    let postStr = "";
                    req.on("data", chunk => postStr += chunk.toString());
                    req.on("end", () => {
                        req.bodyStr = postStr;
                    });
                    break;
            }
        })

        // 处理静态资源
        handleStatic(method, req)
            .then(data => { // 是静态资源
                const splits = url.parse(req.url).pathname.split('/')
                const pathName = splits[splits.length - 1]
                
                mime(pathName, emitter);
                emitter.on("onContentType", _mime => {
                    res.writeHead(200, { "Content-Type": `${_mime};charset=utf-8` });
                    res.write(
                        data, 'binary'
                    );
                    res.end();
                });
            })
            .catch(err => { // 不是静态资源
                // 解析路由动态参数部分
                const _pathName = url.parse(req.url).pathname; // http://127.0.0.1:1001/login => login
                const pathName = Object.keys(routes[method]).find(item => {
                    const matched = _pathName.match(item)
                    const hasParam = routes[method][item].params.length
                    if (matched && !matched.index && hasParam) { // 是动态路由
                        return true
                    } else if (matched && !matched.index && !hasParam && _pathName === item) { // 普通路由
                        return true
                    }
                })
                
                // 匹配动态参数
                let params = {}
                if (pathName) {
                    const _params = _pathName.slice(pathName.length).split('/').slice(1)
                    params = routes[method][pathName].params.reduce((acc, item, index) => {
                        acc[item] = _params[index]
                        return acc
                    },{})
                }
                pathName // 能匹配到路由吗
                    ? method === "get" // 匹配到路由，判断 method 类型是 get 吗
                        ? (() => { // method 类型为 get
                            req._params = params
                            routes[method][pathName].callback(req, res)
                        })()
                        : (() => { // method 类型为 post
                            // 开始获取 formData
                            let payload = "";
                            req.on("data", chunk => (payload += chunk.toString()));
                            // formData 获取完成，把 payload 和 动态参数挂载到 body 上，提供方便访问
                            req.on("end", () => {
                                req.body = payload;
                                req._params = params
                                routes[method][pathName].callback(req, res);
                            });
                        })()  
                    : routes["/404"](req, res)// 未匹配到路由，则认为是 404
                    })

        
    });

    // 注册中间件，中间件类似 Vue.js 里的生命周期钩子
    server.use = middle => {
        if (!middle) {
            return
        }
        // 处理静态资源中间件
        if(middle.constructor === Staticer) { 
            !Staticer.assetsList && (Staticer.assetsList = [])
            Staticer.assetsList.push(middle)
        }
        // 处理获取 post 请求参数中间件
        if(middle.constructor === BodyParser) { 
            !Staticer.bodyParser && (Staticer.bodyParser = [])
            Staticer.bodyParser.push(middle)
        }
        
        // 中间件有很多种，可以继续添加内置中间件，如处理 post 请求的中间件、session 中间件等，或提供开发者自行添加需要的中间件。
    }
    // 注册 get 和 post 方法
    methods.forEach(item => {
      server[item] = (route, callback) => {
        // 解析动态路由参数和路由名
        const { route: routeName, params } = matchDynRoute(route)
        routes[item][routeName] = {
            callback,
            params,
        }
      }
    });

    return server;
};

// 注册静态资源对象
SimpleExpress.static = dir => new Staticer(dir)
// 注册 post 请求参数获取者
SimpleExpress.bodyParser = type => new BodyParser(type)

