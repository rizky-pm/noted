const socketMap = new Map<string, WebSocket>();

export const getWebSocket = (path: string): WebSocket => {
  if (!path) {
    throw new Error('WebSocket path must be provided');
  }

  const url = `ws://localhost:8080${path}`;

  const existingSocket = socketMap.get(path);
  if (existingSocket && existingSocket.readyState !== WebSocket.CLOSED) {
    return existingSocket;
  }

  const newSocket = new WebSocket(url);
  socketMap.set(path, newSocket);

  return newSocket;
};
