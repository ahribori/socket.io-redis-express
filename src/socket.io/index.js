const fs = require('fs');
const path = require('path');
const redis = require('socket.io-redis');

const createServer = (app, port) => {

    // Create HTTP Server
    const server = require('http').createServer(app);

    // Initialize SocketIO
    const io = require('socket.io')(server, {
        path: '/socket.io',
        transports: ['websocket'],
    });

    // SocketIO - Redis configuration
    io.adapter(redis({ host: 'localhost', port: 6379 }));

    // Load namespace modules
    const namespaces = fs.readdirSync(path.resolve(__dirname, 'namespaces'));
    namespaces.forEach(namespace => {
        const createNamespace = require(path.resolve(__dirname, 'namespaces', namespace));
        createNamespace(io);
    });

    // Listen
    server.listen(port, () => {
        console.log(`listen ${port}`);
    });

};

module.exports = createServer;

