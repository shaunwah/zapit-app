import { RxStompService } from '../services/rx-stomp.service';
import { rxStompConfig } from '../../../rx-stomp.config';

export function rxStompFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(rxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
