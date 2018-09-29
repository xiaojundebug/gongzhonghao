# wechat-public-account

用 nodejs+koa2+图灵机器人 api 开发的一个简单个人公众号

## 目录说明

```
├── README.md
├── package.json
├── yarn.lock
├── wechat.config.json                // 微信模块配置文件
├── turing-robot.config.json          // 图灵机器人模块配置文件
├── app.js                            // 项目启动入口
├── lib                               // 二次封装的一些库
│   ├── http.js                       // 封装axios
│   └── print.js                      // 封装chalk
├── wechat                            // 微信模块文件夹
│   ├── access_token.json             // accessToken存储文件
│   ├── menus.json                    // 菜单配置文件
│   ├── msg.js                        // 消息处理
│   └── index.js
├── turing-robot                      // 图灵机器人模块文件夹
│   └── index.js
```

## 功能介绍

- [x] 微信接入 token 认证
- [x] access_token 的获取、存储及更新
- [x] 创建菜单
- [x] 聊天机器人

## 使用方法

懒得写太多了，具体接入流程网上很多，请自行修改配置文件，内网穿透用的是 `natapp`
