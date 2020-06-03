import { BrokerInterface } from '../typings/broker.interface';
import BarInterface from '../typings/bar.interface';
import { StoreInterface } from '../typings/store.interface';
import { OrderInterface } from '../typings/order.interface';

const backtestBroker = {
  execute: (order: OrderInterface) => {
    console.log('Order taken', order);
  },
  watch: (store: StoreInterface, bar: BarInterface): Promise<void> =>
    new Promise(resolve => {
      for (const state of store) {
        console.log('Watching the bar:', state, bar);
      }
      resolve();
    }),
} as BrokerInterface;

export { backtestBroker };
