import BarInterface from './bar.interface';
import { InstrumentInterface } from './instument.interface';
import { OrderInterface } from './order.interface';

export interface StrategyStateInterface {
  orders: OrderInterface[];
}

export interface StrategyInterface {
  key: string;
  defaults: any;
  defaultState: StrategyStateInterface;
  digest(
    state: StrategyStateInterface,
    instrument: InstrumentInterface,
    bar: BarInterface,
    options: any,
  ): Promise<StrategyStateInterface>;
}
