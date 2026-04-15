import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://week5-day2-backend.onrender.com';

let socket: Socket | null = null;

export const initiateSocket = (token: string): Socket => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
