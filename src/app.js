/* =========================================
 Load dependencies
 ============================================*/
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const createServer = require('./socket.io');
const config = require('./conf');
/* =========================================
 Express Configuration
 ============================================*/
const app = express();

const port = process.argv[2] || process.env.PORT || config.port;

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Resolve client example
app.get('/', (req, res) => {
  fs.readFile(path.resolve('client_example', 'index.html'),
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      data = data.toString().replace(/<%=host%>/gi, req.headers.host);
      res.end(data);
    });
});

// set public path
app.use('/', express.static(path.resolve('public')));

/* handle error */
app.use(function(err, req, res, next) {
  if (err) console.log(err);
  res.status(err.status || 500).send('Something broke!');
});

createServer(app, port);
