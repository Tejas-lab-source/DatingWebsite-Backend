// socketManager.js
let ioInstance = null;

const userSocketMap = {};

const setIo = (io) => {
  ioInstance = io;
};

const getIo = () => ioInstance;

module.exports = {
  userSocketMap,
  setIo,
  getIo,
};
