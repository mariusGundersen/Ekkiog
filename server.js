const PORT = process.env.PORT || 8080;

const Koa = require('koa');
const favicon = require('koa-favicon');
const session = require('koa-session');
const static = require('koa-static');
const morgan = require('koa-morgan');
const route = require('koa-route');
const mount = require('koa-mount');
const Grant = require('grant-koa');
const webpack = require('koa-webpack');
const request = require('request');
const requestAsync = require('request-promise');
const purest = require('purest')({request, promise: Promise});
const providers = require('@purest/providers');
const config = require('./config/secrets.json');
const app = new Koa();

app.keys = [process.env.SECRET || config["session-key"]];

const grant = new Grant(grantConfig());

const githubApi = purest({
  provider: 'github',
  config: providers,
  defaults: {
  headers: {
    "User-Agent": 'ekkiog'
  }
}});

app.use(webpack());
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

  ctx.session = {
    provider: "github",
    server: "github.com",
    user: user.login,
    access_token: ctx.session.grant.response.access_token
  };

  return ctx.redirect('/');
}));

app.use(route.get('/git/:server/:user/:repo/info/refs', async (ctx, ...[server, user, repo]) => {
  const service = ctx.query['service'];
  ctx.body = await requestAsync(`https://${server}/${user}/${repo}/info/refs?service=${service}`, {
    ...authorization(server, user, ctx.session)
  });
}));

app.use(route.post('/git/:server/:user/:repo/:service', async (ctx, ...[server, user, repo, service]) => {
  if(service === 'git-receive-pack'){
    if(ctx.session.server !== server
    || ctx.session.user !== user){
      ctx.status = 403;
      return;
    }
  }

  ctx.body = request(`https://${server}/${user}/${repo}/${service}`, {
    method: 'POST',
    body: ctx.req,
    headers: {
      'Content-Type': `application/x-${service}-request`,
      'Accept': `application/x-${service}-result`,
      'User-Agent': 'Ekkiog'
    },
    ...authorization(server, user, ctx.session)
  })
}));

app.use(route.get('/debug', ctx => {
  ctx.body = ctx.session;
}));

app.use(route.get('/git', ctx => {
  ctx.body = `<!doctype html>
  <html>
    <script src="/git.js"></script>
    <h2>git test</h2>
  </html>`
}));

app.listen(PORT);

console.log(`server started on localhost:${PORT}`);

function authorization(server, user, session){
  if(session.server !== server) return {};
  if(session.user !== user) return {};
  return {
    auth: {
      user,
      password: session.access_token
    }
  };
}

function sessionConfig(){
  return {
    key: 'ekkiog', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 1000*60*60*24*365,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  };
}

function grantConfig(){
  return {
    "server": {
      "protocol": "http",
      "host": "localhost:8080",
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