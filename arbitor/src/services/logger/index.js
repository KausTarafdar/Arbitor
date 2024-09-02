import chalk from "chalk";

export function logMiddleware(req, res, next) {
  const log = console.log;

  var ip = req.ip
  if((ip).substr(0,7) === '::ffff:') {
    ip = ip.slice(7);
  }
  else if (ip === '::1') {
    ip = 'localhost';
  }

  const path = `${req.method} :: ${ip + req.path} :: ${new Date().toUTCString()}`
  const userAgent = req.headers['user-agent'];

  log(chalk.greenBright('Request Logged'));
  log(chalk.blueBright(path));
  log(chalk.magenta('user agent: ', chalk.yellowBright(userAgent)));
  next();
};