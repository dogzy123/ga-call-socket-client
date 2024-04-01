import { io, Socket } from 'socket.io-client';
import { WS_URL } from './config';

let socket: Socket;

function initializeSocket(id: string) {
  socket = io(WS_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 3,
    query: {
      userId: id,
    },
  });
  return socket;
}

export { initializeSocket, socket };
