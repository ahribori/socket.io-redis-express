const fs = require('fs');
const path = require('path');
const redis = require('redis');
const socketIoRedisAdapter = require('socket.io-redis');
const config = require('../conf');
const authMiddleware = require('./middlewares/auth');
const { redis: redisConfig } = config;

const createServer = (app, port) => {
  // Create HTTP Server
  const server = require('http').createServer(app);

  // Initialize SocketIO
  const io = require('socket.io')(server, {
    path: '/socket.io',
    transports: ['websocket'],
  });

  io.use(authMiddleware);

  // SocketIO - Redis configuration
  if (redisConfig.enable) {
    const { host, port, password } = redisConfig;

    if (host && port > 0) {
      const pubClient = redis.createClient({ host, port, password });
      const subClient = redis.createClient({ host, port, password });
      const redisAdapter = socketIoRedisAdapter({ pubClient, subClient });

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
