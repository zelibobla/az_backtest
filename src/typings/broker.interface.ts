import BarInterface from './bar.interface';
import { OrderInterface } from './order.interface';
import { StrategyStateInterface } from './strategy.interface';

export interface BrokerInterface {
  execute(order: OrderInterface): Promise<OrderInterface>;
  watch(state: StrategyStateInterface, bar: BarInterface): Promise<void>;
}
