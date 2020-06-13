import BarInterface from './bar.interface';
import { StoreInterface } from './store.interface';
import { OrderInterface } from './order.interface';

export interface BrokerInterface {
  execute(order: OrderInterface): Promise<OrderInterface>;
  watch(store: StoreInterface, bar: BarInterface): Promise<void>;
}
