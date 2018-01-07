const config = process.env.SECRET
  ? JSON.parse(process.env.SECRET)
  : require(__dirname + '/../config/secrets.json');

module.exports.keys = function keys(){
  return [
    config["session-key"]
  ];
}

module.exports.sessionConfig = function sessionConfig(){
  return {
    key: 'ekkiog', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 'session',
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  };
}

module.exports.grantConfig = function grantConfig(){
  return {
    "server": {
      "protocol": config.grant.protocol,
      "host": config.grant.host,
      "callback": "/callback",
      "transport": "session",
      "state": true
    },
    "github": {
      ...config.grant["github"],
      "scope": ["public_repo"],
      "callback": "/github/callback"
    }
  };
}