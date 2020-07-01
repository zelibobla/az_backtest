import {
  OrderInterface,
  OrderStatusEnum,
  OrderDirectionEnum,
} from '../typings/order.interface';
import { StrategyStateInterface } from '../typings/strategy.interface';
import BarInterface from '../typings/bar.interface';
import { setStatus } from '../services/orderService';
import {
  handleTradeSwing,
  handleTradeOpen,
  handleTradeClose,
} from './tradeService';

const triggerChange = (
  order: OrderInterface,
  status: OrderStatusEnum,
  bar: BarInterface,
  state: StrategyStateInterface,
): void => {
  switch (status) {
    case OrderStatusEnum.FILLED:
      handleTradeSwing(state, order, bar);
      handleTradeOpen(state, order);
      handleTradeClose(state, order, bar);
      setStatus(order, OrderStatusEnum.FILLED, bar);
      const direction = order.direction === OrderDirectionEnum.SELL ? -1 : +1;
      const position =
        state.positions.get(order.symbol) || 0 + order.quantity * direction;
      state.positions.set(order.symbol, position);
      break;
    default:
      setStatus(order, status, bar);
  }
};

export { triggerChange };
