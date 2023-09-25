import { Clock } from './clock';

export class SystemClock implements Clock {
  time() {
    return new Date();
  }
}
