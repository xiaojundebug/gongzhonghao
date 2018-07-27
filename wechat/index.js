const crypto = require("crypto"), // 引入加密模块
  util = require("util"), // 引入 util 工具包
  fs = require("fs"), // 引入 fs 模块
  parseString = require("xml2js").parseString, // 引入 xml 解析模块
  accessTokenJson = require("./access_token"), // 引入本地存储的 access_token
  menus = require("./menus"), // 引入菜单配置
  msg = require("./msg"), // 引入消息发送模块
  http = require("../lib/http"), // 引入封装的 axios 模块
  print = require("../lib/print"), // 引入封装的日志打印模块
  turingRobotConfig = require("../turing-robot.config"), // 引入图灵机器人的配置文件
  TulingRobot = require("../turing-robot"); // 引入图灵机器人模块

// 实例一个聊天机器人
const robot = new TulingRobot(turingRobotConfig);

/**
 * 封装的 WeChat 类
 */
class WeChat {
  constructor(config) {
    this.config = config;
    this.token = config.token;
    this.appID = config.appID;
    this.appScrect = config.appScrect;
    this.apiDomain = config.apiDomain;
    this.apiURL = config.apiURL;
  }
  /**
   * 接入 token 验证
   */
  auth() {
    return ctx => {
      this.createMenu()
        .then(result => {
          print.info("菜单创建成功");
          print.info(JSON.stringify(result));
        })
        .catch(err => {
          print.error("菜单创建失败");
          print.error(JSON.stringify(err));
        });

      // 1.获取微信服务器 Get 请求的参数 signature、timestamp、nonce、echostr
      const signature = ctx.query.signature, // 微信加密签名
        timestamp = ctx.query.timestamp, // 时间戳
        nonce = ctx.query.nonce, // 随机数
        echostr = ctx.query.echostr; // 随机字符串
      // 2.将 token、timestamp、nonce 三个参数进行字典排序
      const array = [this.token, timestamp, nonce];
      array.sort();
      // 3.将三个参数字符串拼接成一个字符串进行 sha1 加密
      const tempStr = array.join("");
      const hashCode = crypto.createHash("sha1"); // 创建加密类型
      const resultCode = hashCode.update(tempStr, "utf8").digest("hex"); // 对传入的字符串进行加密
      // 4.开发者获得加密后的字符串可与 signature 对比，标识该请求来源于微信
      if (resultCode === signature) {
        ctx.body = echostr;
      } else {
        ctx.body = "mismatch";
      }
    };
  }
  /**
   * 获取 access_token
   */
  getAccessToken() {
    return new Promise((resolve, reject) => {
      const currentTime = Date.now();
      // 格式化请求地址
      const url = util.format(this.apiURL.accessTokenApi, this.apiDomain, this.appID, this.appScrect);
      // 判断本地存储的 access_token 是否过期
      if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
        http
          .get(url)
          .then(result => {
            accessTokenJson.access_token = result.access_token;
            accessTokenJson.expires_time = new Date().getTime() + parseInt(result.expires_in) * 1000;
            // 更新本地存储的
            fs.writeFile("./wechat/access_token.json", JSON.stringify(accessTokenJson));
            resolve(accessTokenJson.access_token);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        // 将本地存储的 access_token 返回
        resolve(accessTokenJson.access_token);
      }
    });
  }
  /**
   * 创建菜单
   */
  createMenu() {
    return new Promise((resolve, reject) => {
      // 首先获取 access_token
      this.getAccessToken().then(token => {
        // 格式化请求连接
        const url = util.format(this.apiURL.createMenu, this.apiDomain, token);
        // 使用 Post 请求创建微信菜单
        http
          .post(url, menus)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }
  /**
   * 处理消息
   */
  handleMsg() {
    return async ctx => {
      await new Promise((resolve, reject) => {
        let buf = "";
        ctx.req.on("data", chunk => {
          buf += chunk;
        });
        ctx.req.on("end", () => {
          parseString(buf, { explicitArray: false }, (err, result) => {
            if (!err) {
              resolve(result.xml);
            } else {
              reject(err);
            }
          });
        });
      }).then(async result => {
        const toUser = result.ToUserName; // 接收方微信
        const fromUser = result.FromUserName; // 发送方微信
        const msgType = result.MsgType; // 消息类型
        const content = result.Content; // 接收到的消息
        let replyMsg = "success"; // 准备回应的消息

        if (msgType === "event") {
          switch (result.Event) {
            // 用户订阅后，给他打一个招呼
            case "subscribe":
              replyMsg = msg.txtMsg(fromUser, toUser, "hi~来和我聊天吧！");
              break;
            default:
              break;
          }
        } else if (msgType === "text") {
          // 从图灵机器人那里获取响应信息
          await robot.sendMsg(content).then(result => {
            replyMsg = msg.txtMsg(fromUser, toUser, result.text);
          });
        }
        ctx.body = replyMsg;
      });
    };
  }
}

module.exports = WeChat;
