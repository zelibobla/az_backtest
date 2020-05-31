import BarInterface from '../typings/bar.interface';
import { BrokerInterface } from '../typings/broker.interface';
import { DecisionInterface } from '../typings/decision.interface';

const processDecisions = async (
  brokerService: BrokerInterface,
  bar: BarInterface,
  decisions: DecisionInterface[],
): Promise<any> => {
  const results = await Promise.all(
    decisions.map(async decision => {
      console.log(bar);
      return await brokerService.execute(decision);
    }),
  );
  return results;
};

export { processDecisions };
