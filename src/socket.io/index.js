const fs = require('fs');
const path = require('path');
const redis = require('socket.io-redis');
const config = require('../conf');
const { redis: redisConfig } = config;

const createServer = (app, port) => {
  // Create HTTP Server
  const server = require('http').createServer(app);

  // Initialize SocketIO
  const io = require('socket.io')(server, {
    path: '/socket.io',
    transports: ['websocket'],
  });

  // SocketIO - Redis configuration
  if (redisConfig.enable) {
    const { host, port } = redisConfig;
    if (host && port > 0) {
      const redisAdapter = redis({ host, port });
      io.adapter(redisAdapter);
      redisAdapter.pubClient.on('connect', () => {
        console.log('Redis adapter pubClient connected');
      });
      redisAdapter.subClient.on('connect', () => {
        console.log('Redis adapter subClient connected');
      });
    }
  }

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
