const PORT = process.env.PORT || 8080;

const express = require('express');
const static = require('serve-static');
const favicon = require('serve-favicon');
const morgan = require('morgan');

const app = express();

app.use(favicon('./dist/favicon.ico'));
app.use(morgan('short'));
app.use(static('./dist'));

app.listen(PORT);

console.log(`server started on localhost:${PORT}`);