module.exports = io => {
  const namespace1 = io.of('/namespace1');
  namespace1.on('connection', socket => {
    socket.join('room1'); // 'room1' room 입장
    // socket.leave('room1', () => {}); // 'room1' room 퇴장
    socket.on('message', message => {
      console.log('/namespace1 -> ' + message);
      // chatroom1.to('room1').emit('message', message); // 'chat1' namespace의 'room1' room에 boardcast (모든 클라이언트에게 메세지를 보냄)
      socket.broadcast.to('room1').emit('message', message); // 'chat1' namespace의 'room1' room에 boardcast (메세지를 보낸 클라이언트를 제외한 나머지에게 broadcast)
    });
  });
};
