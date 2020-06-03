import { OrderInterface } from '../typings/order.interface';
import { BrokerInterface } from '../typings/broker.interface';
import { StoreInterface } from '../typings/store.interface';

const processOrders = async (
  store: StoreInterface,
  brokerService: BrokerInterface,
  orders: OrderInterface[],
): Promise<any> => {
  const results = await Promise.all(
    orders.map(async order => {
      console.log(store);
      return await brokerService.execute(order);
    }),
  );
  return results;
};

export { processOrders };
