const socketMap = new Map<string, WebSocket>();

export const getWebSocket = (path: string): WebSocket => {
  if (!path) {
    throw new Error('WebSocket path must be provided');
  }

  const url = `${import.meta.env.VITE_WS_URL}${path}`;

  const existingSocket = socketMap.get(path);
  if (existingSocket && existingSocket.readyState !== WebSocket.CLOSED) {
    return existingSocket;
  }

  const newSocket = new WebSocket(url);
  socketMap.set(path, newSocket);

  return newSocket;
};
