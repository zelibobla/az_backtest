import BarInterface from './bar.interface';
import { InstrumentInterface } from './instument.interface';
import { OrderInterface } from './order.interface';

export interface StrategyState {
  orders: OrderInterface[];
}

export interface StrategyOutputInterface {
  state: StrategyState;
  decisions: [];
}

export interface StrategyInterface {
  key: string;
  defaults: any;
  defaultState: any;
  digest(
    instrument: InstrumentInterface,
    options: any,
    state: StrategyState,
    bar: BarInterface,
  ): Promise<StrategyOutputInterface>;
}

export interface DecisionInterface {
  order?: string;
}
