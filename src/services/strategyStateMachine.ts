import {
  OrderInterface,
  OrderStatusEnum,
  OrderDirectionEnum,
} from '../typings/order.interface';
import { orderFactory } from '../factories/orderFactory';
import { StrategyStateInterface } from '../typings/strategy.interface';
import { TradeStatusEnum } from '../typings/trade.interface';
import BarInterface from '../typings/bar.interface';

const getChildren = (
  order: OrderInterface,
  state: StrategyStateInterface,
): Array<OrderInterface> => {
  if (!order.children) {
    return [];
  }
  const children = order.children.map(childHash => state.orders.get(childHash));
  return children;
};

const getSiblings = (
  order: OrderInterface,
  state: StrategyStateInterface,
): Array<OrderInterface> => {
  if (!order.parentHash) {
    return [];
  }
  const parent = state.orders.get(order.parentHash);
  if (!parent || !parent.children) {
    return [];
  }
  const siblings = parent.children
    .filter(childHash => childHash !== order.hash)
    .map(childHash => state.orders.get(childHash));
  return siblings;
};

const switchOrderStatus = (
  order: OrderInterface,
  status: OrderStatusEnum,
  bar: BarInterface,
  state: StrategyStateInterface,
): void => {
  switch (status) {
    case OrderStatusEnum.FILLED:
      const activeTrade = state.trades.find(
        t => t.status === TradeStatusEnum.ACTIVE,
      );
      if (activeTrade) {
        const orphans = getChildren(activeTrade.openOrder, state);
        orphans.forEach(o =>
          switchOrderStatus(o, OrderStatusEnum.CANCELED, bar, state),
        );
        activeTrade.status = TradeStatusEnum.CLOSED;
        activeTrade.closeOrder = order;
      }
      const trade = state.trades.find(t => t.hash === order.tradeHash);

      const children = orderFactory.createChildren(trade, order);
      if (children && children.length) {
        children.forEach(child => state.orders.set(child.hash, child));
        trade.status = TradeStatusEnum.ACTIVE;
      }
      const siblings = getSiblings(order, state);
      if (siblings && siblings.length) {
        siblings.forEach(o =>
          switchOrderStatus(o, OrderStatusEnum.CANCELED, bar, state),
        );
        trade.status = TradeStatusEnum.CLOSED;
        trade.closeOrder = order;
      }
      order.filledPrice = bar.close;
      order.status = status;
      order.bar = bar;
      const direction = order.direction === OrderDirectionEnum.SELL ? -1 : +1;
      const position =
        state.positions.get(order.symbol) || 0 + order.quantity * direction;
      state.positions.set(order.symbol, position);
      break;
    default:
      order.status = status;
      order.bar = bar;
  }
};

export { switchOrderStatus };
