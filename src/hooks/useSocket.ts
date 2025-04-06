import { useEffect, useRef } from 'react';
import { getWebSocket } from '@/lib/socket';

export const useSocket = (path: string) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!path) return;

    socketRef.current = getWebSocket(path);

    const socket = socketRef.current;

    socket.onopen = () => {
      console.log(`WebSocket connected to ${path}`);
    };

    socket.onclose = () => {
      console.log(`WebSocket disconnected from ${path}`);
    };

    socket.onerror = (err) => {
      console.error(`WebSocket error on ${path}:`, err);
    };

    return () => {
      socket.close();
    };
  }, [path]);

  return socketRef.current;
};
