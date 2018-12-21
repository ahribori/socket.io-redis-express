/* =========================================
 Load dependencies
 ============================================*/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createServer = require('./socket.io');

/* =========================================
 Express Configuration
 ============================================*/
const app = express();

const port = process.argv[2] || process.env.PORT || 8080;

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public path
app.use('/', express.static(path.resolve('client_example')));

/* handle error */
app.use(function (err, req, res, next) {
    if (err) console.log(err);
    res.status(err.status || 500).send('Something broke!');
});

createServer(app, port);
