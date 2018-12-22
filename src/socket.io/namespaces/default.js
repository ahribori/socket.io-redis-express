module.exports = io =>
  io.sockets.on('connection', socket => {
    const { id, nsp } = socket;
    console.log(`[ID=${id}, NAMESPACE=${nsp.name}] connected.`);
    socket.on('message', message => {
      console.log('/ -> ' + message);
      socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', reason => {
      console.log(`[ID=${id}, NAMESPACE=${nsp.name}] disconnected. (${reason})`);
    });
  });
