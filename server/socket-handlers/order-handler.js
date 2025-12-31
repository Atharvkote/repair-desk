import logger from "../utils/logger.js";

export const initializeOrderHandlers = (io) => {
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("join:order", (orderId) => {
      if (orderId) {
        const room = `order:${orderId}`;
        socket.join(room);
        logger.info(`Socket ${socket.id} joined room: ${room}`);
        socket.emit("joined:order", { orderId, room });
      }
    });

    socket.on("leave:order", (orderId) => {
      if (orderId) {
        const room = `order:${orderId}`;
        socket.leave(room);
        logger.info(`Socket ${socket.id} left room: ${room}`);
        socket.emit("left:order", { orderId, room });
      }
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

