# wechat-public-account

一个用 nodejs+koa2+图灵机器人开发的简单个人公众号

## 目录说明

```
├── README.md
├── package.json
├── yarn.lock
├── wechat.config.json                // 微信模块配置文件
├── turing-robot.config.json          // 图灵机器人模块配置文件
├── app.js                            // 项目启动入口
├── lib                               // 一些模块的封装
│   ├── http.js                       // 封装的axios模块
│   └── print.js                      //  封装的日志打印模块
├── wechat                            // 微信模块文件夹
│   ├── access_token.json             // accessToken存储文件
│   ├── menus.json                    // 菜单配置文件
│   ├── msg.js                        // 消息模块
│   └── index.js                      //  主模块
├── turing-robot                      // 图灵机器人模块文件夹
│   └── index.js                      // 主模块
```

## 功能介绍

- [x] 微信接入 token 认证
- [x] access_token 的获取、存储及更新
- [x] 创建菜单
- [x] 聊天机器人

## 使用方法

懒得写太多了，具体接入流程网上很多，请自行修改配置文件，不多说了，内网穿透用的是 natapp
