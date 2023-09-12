import { RxStompConfig } from '@stomp/rx-stomp';
import { environment } from './environments/environment';

export const rxStompConfig: RxStompConfig = {
  brokerURL: environment.websocketUrl,
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200,
  debug: (message: string): void => {
    console.log(message);
  },
};
