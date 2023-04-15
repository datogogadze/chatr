import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { MessageEntity } from 'src/entities/message.entity';

export interface CustomSocket extends Socket {
  user?: any;
  messages: MessageEntity[];
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: CustomSocket = context.switchToWs().getClient();
    WsJwtGuard.validateToken(client);
    return true;
  }

  static validateToken(client: CustomSocket) {
    const token: string = client.handshake.auth.token.split(' ')[1];
    if (client.user) {
      return client.user;
    }
    const payload = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    client.user = payload;
    client.messages = [];
    return payload;
  }
}
