import { BrokerInterface } from '../typings/broker.interface';
import BarInterface from '../typings/bar.interface';
import { StoreInterface } from '../typings/store.interface';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  OrderDirectionEnum,
  OrderInterface,
} from '../typings/order.interface';
import { switchStatus } from '../services/orderStateMachine';
import { StrategyStateInterface } from '../typings/strategy.interface';

const watchOrders = (
  bar: BarInterface,
  orders: OrderInterface[],
  state: StrategyStateInterface,
) => {
  orders.forEach(order => {
    if (
      order.type === OrderTypeEnum.MKT ||
      (OrderTypeEnum.LMT &&
        order.direction === OrderDirectionEnum.SELL &&
        bar.close >= order.initialPrice) ||
      (order.direction === OrderDirectionEnum.BUY &&
        bar.close <= order.initialPrice) ||
      (OrderTypeEnum.STP &&
        order.direction === OrderDirectionEnum.SELL &&
        bar.close <= order.initialPrice) ||
      (order.direction === OrderDirectionEnum.BUY &&
        bar.close >= order.initialPrice)
    ) {
      switchStatus(order, OrderStatusEnum.FILLED, state);
    }
  });
};

const backtestBroker = {
  watch: async (store: StoreInterface, bar: BarInterface): Promise<void> => {
    for (const strategyRecord of store) {
      const ordersGrouped = strategyRecord.state.orders.reduce(
        (memo, order) => {
          if (
            [OrderStatusEnum.NEW, OrderStatusEnum.PENDING].indexOf(
              order.status,
            ) === -1
          ) {
            return memo;
          }
          memo[order.status].push(order);
          return memo;
        },
        { [OrderStatusEnum.NEW]: [], [OrderStatusEnum.PENDING]: [] },
      );
      ordersGrouped[OrderStatusEnum.NEW].forEach(o =>
        switchStatus(o, OrderStatusEnum.PENDING, strategyRecord.state),
      );
      watchOrders(
        bar,
        ordersGrouped[OrderStatusEnum.PENDING],
        strategyRecord.state,
      );
      console.log(
        'Filled orders:',
        strategyRecord.state.orders.filter(
          o => o.status === OrderStatusEnum.FILLED,
        ).length,
        'Pending orders:',
        strategyRecord.state.orders.filter(
          o => o.status === OrderStatusEnum.PENDING,
        ).length,
        'Canceled orders:',
        strategyRecord.state.orders.filter(
          o => o.status === OrderStatusEnum.CANCELED,
        ).length,
      );
    }
  },
} as BrokerInterface;

export { backtestBroker };
