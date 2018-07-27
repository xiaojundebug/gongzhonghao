/**
 * axios 封装
 */

const axios = require("axios");
const wxConfig = require("../wechat.config");

// 响应拦截器
axios.interceptors.response.use(
  res => {
    const { data } = res;
    const { url } = res.config;
    // 判断是否微信域名
    if (url.indexOf(wxConfig.apiDomain) !== -1) {
      if (!data.errcode) {
        return data;
      } else {
        return Promise.reject(data);
      }
    }
    return data;
  },
  err => {
    return Promise.reject(err);
  }
);

module.exports = axios;
