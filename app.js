const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const Wechat = require("./wechat"); // 引入封装的微信公众号模块
const wxConfig = require("./wechat.config"); // 引入微信公众号相关配置

const app = new Koa();

const wechatApp = new Wechat(wxConfig);

const router = new Router();

// 控制台打印访问记录
app.use(logger());
// 解析 post 方式提交的数据
app.use(bodyParser());
// 接入 Token 验证
router.get("/", wechatApp.auth());
// 消息处理
router.post("/", wechatApp.handleMsg());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001);
