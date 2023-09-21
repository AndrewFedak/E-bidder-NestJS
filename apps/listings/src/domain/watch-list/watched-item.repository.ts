// Repository Interface is defined in Domain layer (here)
// implementation in Infrastructure layer

import { WatchedItem } from './watched-item';

export interface IWatchedItemRepository {
  findBy(id: string): WatchedItem;
  add(watched: WatchedItem): void;
  remove(watched: WatchedItem): void;
}
