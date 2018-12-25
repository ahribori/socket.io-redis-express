module.exports = (socket, next) => {
  const { accessToken } = socket.handshake.query;

  // validate accessToken
  if (!accessToken) {
    return next(new Error('authentication error'));
  }
  console.log(accessToken);

  return next();
};
