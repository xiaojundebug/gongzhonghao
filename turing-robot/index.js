const http = require("../lib/http");

/**
 * 图灵机器人
 */
class TuringRobot {
  constructor(config) {
    this.config = config;
    this.apikey = config.apikey;
    this.secret = config.secret;
    this.openapi = config.openapi;
  }
  // 向图灵机器人发送消息
  sendMsg(msg) {
    return new Promise((resolve, reject) => {
      http
        .post(this.openapi, {
          key: this.apikey,
          info: msg
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = TuringRobot;
