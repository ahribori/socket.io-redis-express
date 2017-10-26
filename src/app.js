/* =========================================
 Load dependencies
 ============================================*/
import './conf';
import appPath from './conf/path'
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import figlet from 'figlet';
import api from './api';

/* =========================================
 Express Configuration
 ============================================*/
const app = express();

const port = process.argv[2] || process.env.PORT || 8080;

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// access log setting
const accessLogStream = fs.createWriteStream(path.join(appPath.LOG_PATH, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, './../public/index.html'),
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            data = data.toString('utf-8').replace(/<%=host%>/gi, req.headers.host);
            res.end(data);
        });
});

// set public path
app.use('/', express.static(path.join(__dirname, './../public')));

// set api router
app.use('/', api);

/* handle error */
app.use(function (err, req, res, next) {
    if (err) console.log(err);
    res.status(err.status || 500).send('Something broke!');
});

/* =========================================
 Socket.io & Redis Configuration
 ============================================*/
const server = require('http').createServer(app);
const redis = require('socket.io-redis');

const io = require('socket.io')(server, {
    path: '/socket.io',
    transports: ['websocket']
});

io.adapter(redis({ host: 'localhost', port: 6379 }));

io.sockets.on('connection', (socket) => {
    console.log('onconnection -> ' + port);
    socket.on('message', (message) => {
         socket.broadcast.emit('message', message);
    });

});

server.listen(port, () => {
    figlet(`${port} PORT`, (err, data) => { console.log(data); })
});