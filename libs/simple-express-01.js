const url = require("url");
const http = require("http");

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
module.exports = function() {
    const server = http.createServer((req, res) => {
        // 解析method：get 或 post
        const method = req.method.toLowerCase();

        // 解析路由动态参数部分
        const _pathName = url.parse(req.url).pathname; // http://127.0.0.1:1001/news/china/1/2 => /news/china/1/2
        const pathName = Object.keys(routes[method]).find(item => { // 1 -> id 2 -> uid
            const matched = _pathName.match(item)
            const hasParam = routes[method][item].params.length
            if (matched && !matched.index && hasParam) { // 是动态路由
                return true
            } else if (matched && !matched.index && !hasParam && _pathName === item) { // 普通路由
                return true
            }
        })
        
        // 匹配动态参数: http://127.0.0.1:1001/news/china/1/2 => {id: 1, uid: 2}
        let params = {}
        if (pathName) {
            const _params = _pathName.slice(pathName.length).split('/').slice(1)
            params = routes[method][pathName].params.reduce((acc, item, index) => {
                acc[item] = _params[index]
                return acc
            },{})
        }

        // 执行对应的路由
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
    });

    // 注册 get 和 post 路由
    methods.forEach(item => {
      server[item] = (route, callback) => {
        // 解析动态路由参数和路由名：/news/china/:id/:uid -> params: [ 'id', 'uid' ]
        const { route: routeName, params } = matchDynRoute(route)
        routes[item][routeName] = {
            callback,
            params,
        }
      }
    });

    return server;
};