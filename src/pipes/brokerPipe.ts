import { from, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { BrokerInterface } from '../typings/broker.interface';
import BarInterface from '../typings/bar.interface';
import { StoreInterface } from '../typings/store.interface';

const brokerPipe = (store: StoreInterface, broker: BrokerInterface) =>
  concatMap(
    (bar: BarInterface): Observable<void> => {
      return from(broker.watch(store, bar));
    },
  );

export { brokerPipe };
