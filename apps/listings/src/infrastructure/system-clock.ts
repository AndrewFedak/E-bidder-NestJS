import { IClock } from './clock';

export class SystemClock implements IClock {
  time() {
    return new Date();
  }
}
