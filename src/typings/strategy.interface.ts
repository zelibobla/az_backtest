import BarInterface from './bar.interface';
import { InstrumentInterface } from './instument.interface';
import { OrderInterface } from './order.interface';
import { TradeInterface } from './trade.interface';

export interface StrategyStateInterface {
  positions: Map<string, number>;
  orders: Map<string, OrderInterface>;
  trades: TradeInterface[];
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
