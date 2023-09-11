import { RxStompConfig } from '@stomp/rx-stomp';
import { environment } from './environments/environment';

export const rxStompConfig: RxStompConfig = {
  brokerURL: 'ws://localhost:8080/websocket', // TODO need to change
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200,
  debug: (message: string): void => {
    console.log(message);
  },
};
