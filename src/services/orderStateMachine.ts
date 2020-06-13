import { OrderInterface, OrderStatusEnum } from '../typings/order.interface';
import { orderFactory } from '../factories/orderFactory';
import { StrategyStateInterface } from '../typings/strategy.interface';

const getSiblings = (
  order: OrderInterface,
  state: StrategyStateInterface,
): Array<OrderInterface> => {
  if (!order.parent) {
    return [];
  }
  const parent = state.orders.find(o => o.hash === order.parent);
  if (!parent || !parent.children) {
    return [];
  }
  const siblings = state.orders.filter(
    o => o.hash !== order.hash && parent.children.includes(o.hash),
  );
  return siblings;
};

const switchStatus = (
  order: OrderInterface,
  status: OrderStatusEnum,
  state: StrategyStateInterface,
) => {
  let result = { toCancel: [] };
  switch (status) {
    case OrderStatusEnum.FILLED:
      const children = orderFactory.createChildren(order);
      state.orders = [...state.orders, ...children];
      const siblings = getSiblings(order, state);
      siblings.forEach(o => switchStatus(o, OrderStatusEnum.CANCELED, state));
      order.filledPrice = order.initialPrice;
      order.status = status;
      break;
    default:
      order.status = status;
  }
  return result;
};

export { switchStatus };
