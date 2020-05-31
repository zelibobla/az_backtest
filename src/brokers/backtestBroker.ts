import { BrokerInterface } from '../typings/broker.interface';
import { DecisionInterface } from '../typings/decision.interface';

const backtestBroker = {
  execute: (decision: DecisionInterface) => {
    console.log('Decision taken', decision);
  },
} as BrokerInterface;

export { backtestBroker };
