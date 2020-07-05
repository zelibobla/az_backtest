import { from, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { BrokerInterface } from '../typings/broker.interface';
import BarInterface from '../typings/bar.interface';
import { StoreInterface } from '../typings/store.interface';

const brokerPipe = (store: StoreInterface, broker: BrokerInterface) =>
  concatMap(
    (bar: BarInterface): Observable<void> => {
      const promises = [];
      for (const strategyRecord of store) {
        promises.push(broker.watch(strategyRecord.state, bar));
      }
      return from(Promise.all(promises).then(() => {}));
    },
  );

export { brokerPipe };
