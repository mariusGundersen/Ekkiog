module.exports = function htmlPage(model = null){
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
        <title>Ekkiog</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
          }

          body {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            touch-action: none;
            overflow: hidden; /* prevent scrollbars */
            background: #31363c;
          }

          button,
          textarea,
          input[type="text"],
          input[type="button"],
          input[type="submit"] {
            -webkit-appearance: none;
            border-radius: 0;
            margin: 0;
            padding: 0;
            border-width: 0;
          }
        </style>
      <link rel="shortcut icon" href="/favicon.ico"></head>
      <body>
        <div class="react-app"></div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(model).replace(/</g, '\\u003c')};
        </script>
        <script src="/index.js"></script></body>
    </html>`;
}