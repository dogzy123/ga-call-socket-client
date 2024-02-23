import { io, Socket } from 'socket.io-client';

const wsUrl =
  process.env.NODE_ENV === 'production'
    ? 'ws://34.88.50.142'
    : 'ws://localhost:65080';

// const wsUrl = 'ws://localhost:65080';

let socket: Socket;

function initializeSocket(name: string) {
  socket = io(wsUrl, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 3,
    query: {
      username: name,
    },
  });
  return socket;
}

export { initializeSocket, socket };
