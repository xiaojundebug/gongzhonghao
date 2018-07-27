/**
 * 日志打印封装
 */

const chalk = require("chalk");

const print = {
  default(msg) {
    console.log(chalk.white(msg));
  },
  info(msg) {
    console.log(chalk.blue(msg));
  },
  warning(msg) {
    console.log(chalk.yellow(msg));
  },
  error(msg) {
    console.log(chalk.red(msg));
  },
  success(msg) {
    console.log(chalk.green(msg));
  }
};

module.exports = print;
