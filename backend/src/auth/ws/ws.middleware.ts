import { Socket } from 'socket.io';
import { CustomSocket, WsJwtGuard } from 'src/guards/ws.guard';

export type SocketIOMiddleware = {
  (client: CustomSocket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  return (client, next) => {
    try {
      WsJwtGuard.validateToken(client);
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
