import { BrokerInterface } from '../typings/broker.interface';
import BarInterface from '../typings/bar.interface';
import { StoreInterface } from '../typings/store.interface';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  OrderDirectionEnum,
  OrderInterface,
} from '../typings/order.interface';
import { switchOrderStatus } from '../services/strategyStateMachine';
import { StrategyStateInterface } from '../typings/strategy.interface';

//const k = 1;
const watchOrders = (
  bar: BarInterface,
  orders: OrderInterface[],
  state: StrategyStateInterface,
): void => {
  orders.forEach(order => {
    if (
      order.type === OrderTypeEnum.MKT ||
      (order.type === OrderTypeEnum.LMT &&
        ((order.direction === OrderDirectionEnum.SELL &&
          bar.close >= order.initialPrice) ||
          (order.direction === OrderDirectionEnum.BUY &&
            bar.close <= order.initialPrice))) ||
      (order.type === OrderTypeEnum.STP &&
        ((order.direction === OrderDirectionEnum.SELL &&
          bar.close <= order.initialPrice) ||
          (order.direction === OrderDirectionEnum.BUY &&
            bar.close >= order.initialPrice)))
    ) {
      switchOrderStatus(order, OrderStatusEnum.FILLED, bar, state);
    }
  });
};

const backtestBroker = {
  watch: async (store: StoreInterface, bar: BarInterface): Promise<void> => {
    for (const strategyRecord of store) {
      const ordersGrouped = {
        [OrderStatusEnum.NEW]: [],
        [OrderStatusEnum.PENDING]: [],
        [OrderStatusEnum.FILLED]: [],
        [OrderStatusEnum.CANCELED]: [],
      };
      for (const [, o] of strategyRecord.state.orders) {
        ordersGrouped[o.status].push(o);
      }
      ordersGrouped[OrderStatusEnum.NEW].forEach(o =>
        switchOrderStatus(
          o,
          OrderStatusEnum.PENDING,
          bar,
          strategyRecord.state,
        ),
      );
      watchOrders(
        bar,
        ordersGrouped[OrderStatusEnum.PENDING],
        strategyRecord.state,
      );
      console.log(
        'New orders:',
        ordersGrouped[OrderStatusEnum.NEW].length,
        'Pending orders:',
        ordersGrouped[OrderStatusEnum.PENDING].length,
        'Filled orders:',
        ordersGrouped[OrderStatusEnum.FILLED].length,
        'Canceled orders:',
        ordersGrouped[OrderStatusEnum.CANCELED].length,
      );
    }
  },
} as BrokerInterface;

export { backtestBroker };
