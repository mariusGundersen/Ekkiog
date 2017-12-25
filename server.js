const PORT = process.env.PORT || 8080;
require('babel-polyfill');
const Koa = require('koa');
const favicon = require('koa-favicon');
const session = require('koa-session');
const static = require('koa-static');
const morgan = require('koa-morgan');
const route = require('koa-route');
const mount = require('koa-mount');
const Grant = require('grant-koa');
const request = require('request');
const proxy = require('@es-git/node-git-proxy').default;

const purest = require('purest')({request, promise: Promise});
const providers = require('@purest/providers');
const config = getConfig();
const app = new Koa();

app.keys = [
  config["session-key"]
];

const grant = new Grant(grantConfig(config));

const githubApi = purest({
  provider: 'github',
  config: providers,
  defaults: {
  headers: {
    "User-Agent": 'ekkiog'
  }
}});

if(process.env.NODE_ENV !== 'production'){
  app.use(require('koa-webpack')());
}

app.use(favicon('./dist/favicon.ico'));
app.use(morgan('short'));
app.use(static('./dist'));
app.use(session(sessionConfig(), app));
app.use(mount(grant));
app.use(route.get('/github/callback', async (ctx, next) => {
  if(ctx.query.error){
    ctx.body = ctx.query.error;
    return;
  }

  const [response, user] = await githubApi
    .get('user')
    .auth(ctx.session.grant.response.access_token)
    .request();

  if(response.statusCode !== 200){
    return ctx.redirect('/connect/github');
  }

  const data = {
    provider: "github",
    server: "github.com",
    username: user.login,
    photo: user.avatar_url,
    name: user.name,
    email: user.email,
    access_token: ctx.session.grant.response.access_token
  };

  ctx.session = null;

  ctx.body = `<!doctype html>
  <html>
    <script>
      localStorage.setItem('ekkiog-user', '${JSON.stringify(data).replace(/</g, '\\u003c')}');
      document.location = '/';
    </script>
  </html>`
}));

app.use(route.get('/debug', ctx => {
  ctx.body = ctx.session;
}));

app.use(route.get('/git', ctx => {
  ctx.body = `<!doctype html>
  <html>
    <script src="/git.js"></script>
    <h2>git test</h2>
    <a href="/connect/github">Github</a>
  </html>`
}));

app.use(mount('/git', ctx => proxy(ctx.req, ctx.res)));

app.listen(PORT);

console.log(`server started on localhost:${PORT}`);

function sessionConfig(){
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

function grantConfig(config){
  return {
    "server": {
      "protocol": "http",
      "host": config.host,
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

function getConfig(){
  if(process.env.SECRET){
    return JSON.parse(process.env.SECRET);
  }
  return require('./config/secrets.json');
}