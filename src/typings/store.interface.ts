import { StrategyStateInterface } from './strategy.interface';

export interface StoreInterface {
  setStrategyState(key: String, state: StrategyStateInterface): void;
  getStrategyState(key: String): StrategyStateInterface;
  [Symbol.iterator];
}
