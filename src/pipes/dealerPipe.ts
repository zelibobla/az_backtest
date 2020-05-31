import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { BrokerInterface } from '../typings/broker.interface';
import { processDecisions } from '../services/dealerService';

const dealerPipe = (brokerService: BrokerInterface) =>
  concatMap((obj: any) => {
    return from(processDecisions(brokerService, obj.bar, obj.decisions));
  });

export { dealerPipe };
