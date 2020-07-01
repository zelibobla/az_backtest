import { OrderInterface, OrderStatusEnum } from '../typings/order.interface';
import { StrategyStateInterface } from '../typings/strategy.interface';
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

const setStatus = (
  order: OrderInterface,
  status: OrderStatusEnum,
  bar: BarInterface,
) => {
  order.filledPrice = bar.close;
  order.status = status;
  order.bar = bar;
};

export { getChildren, getSiblings, setStatus };
