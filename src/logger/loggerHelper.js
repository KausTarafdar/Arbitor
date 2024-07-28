import chalk from "chalk";

export function logHandler(req, res, next) {
  const log = console.log;
  const hosturl = req.rawHeaders[1] + req.url;
  const method = req.method;
  const browswer = req.rawHeaders[15];
  const time = new Date();
  var platform = req.rawHeaders[req.rawHeaders.indexOf("sec-ch-ua-mobile") + 1];
  if(platform == '?0'){
    platform = req.rawHeaders[req.rawHeaders.indexOf("sec-ch-ua-platform") + 1];
  }
  log(chalk.greenBright('Request Logged'));
  log(chalk.blueBright('hostname :'), chalk.yellowBright(hosturl));
  log(chalk.blueBright('method :', chalk.yellowBright(method)));
  log(chalk.blueBright('platform: ', chalk.yellowBright(platform)));
  log(chalk.blueBright('browser: ', chalk.yellowBright(browswer)));
  log(chalk.blueBright('time: ', chalk.yellowBright(time)), '\n');
  next();
};