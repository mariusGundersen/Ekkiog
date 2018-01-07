require('babel-polyfill');
const Koa = require('koa');
const favicon = require('koa-favicon');
const session = require('koa-session');
const static = require('koa-static');
const morgan = require('koa-morgan');
const route = require('koa-route');
const mount = require('koa-mount');
const Grant = require('grant-koa');
const proxy = require('@es-git/node-git-proxy').default;

const config = require('./backend/getConfig');
const github = require('./backend/github');
const htmlPage = require('./backend/html');

const app = new Koa();
app.keys = config.keys();

if(process.env.NODE_ENV !== 'production'){
  app.use(require('koa-webpack')());
}

app.use(favicon('./dist/favicon.ico'));
app.use(morgan('short'));
app.use(static('./dist'));
app.use(session(config.sessionConfig(), app));
app.use(mount(new Grant(config.grantConfig())));
app.use(route.get('/github/callback', async (ctx, next) => {
  if(ctx.query['error[error]']){
    ctx.body = ctx.query['error[error_description]'];
    return;
  }

  if(!ctx.session){
    return ctx.redirect('/');
  }

  const [response, user] = await github.getUser(ctx.session.grant.response.access_token);

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
    access_token: ctx.session.grant.response.access_token,
    repo: 'ekkiog-workspace'
  };

  ctx.session = null;

  ctx.body = htmlPage(data);
}));

app.use(mount('/git', ctx => proxy(ctx.req, ctx.res)));

app.use(route.get('/demo', ctx => {
  ctx.body = htmlPage();
}));

app.use(route.get('/', ctx => {
  ctx.body = htmlPage();
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log(`server started on localhost:${PORT}`);
