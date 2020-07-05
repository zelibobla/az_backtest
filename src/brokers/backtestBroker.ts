import { BrokerInterface } from '../typings/broker.interface';
import BarInterface from '../typings/bar.interface';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  OrderDirectionEnum,
  OrderInterface,
} from '../typings/order.interface';
import { triggerChange } from '../services/tradeStateMachine';
import { StrategyStateInterface } from '../typings/strategy.interface';

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
      triggerChange(order, OrderStatusEnum.FILLED, bar, state);
    }
  });
};

const backtestBroker = {
  watch: async (
    state: StrategyStateInterface,
    bar: BarInterface,
  ): Promise<void> => {
    const ordersGrouped = {
      [OrderStatusEnum.NEW]: [],
      [OrderStatusEnum.PENDING]: [],
      [OrderStatusEnum.FILLED]: [],
      [OrderStatusEnum.CANCELED]: [],
    };
    for (const [, o] of state.orders) {
      ordersGrouped[o.status].push(o);
    }
    ordersGrouped[OrderStatusEnum.NEW].forEach(o =>
      triggerChange(o, OrderStatusEnum.PENDING, bar, state),
    );
    watchOrders(bar, ordersGrouped[OrderStatusEnum.PENDING], state);
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
  },
} as BrokerInterface;

export { backtestBroker };
