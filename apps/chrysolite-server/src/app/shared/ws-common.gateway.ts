import { Server } from 'ws';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from '@biorate/nestjs-tools';

@WebSocketGateway()
@UseFilters(new AllExceptionsFilter())
export abstract class WsCommonGateway {
  @WebSocketServer()
  protected server: Server;
}
