import { DecisionInterface } from './decision.interface';

export interface BrokerInterface {
  execute(decision: DecisionInterface);
}
