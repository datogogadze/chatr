import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';

@Module({ imports: [AppGateway] })
export class GatewayModule {}
