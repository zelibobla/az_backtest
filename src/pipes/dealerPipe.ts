import { from, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { BrokerInterface } from '../typings/broker.interface';
import { processOrders } from '../services/dealerService';
import { StoreInterface } from '../typings/store.interface';
import { StrategyStateInterface } from '../typings/strategy.interface';

const dealerPipe = (store: StoreInterface, broker: BrokerInterface) =>
  concatMap(
    (state: StrategyStateInterface): Observable<void> => {
      return from(processOrders(store, broker, state.orders));
    },
  );

export { dealerPipe };
