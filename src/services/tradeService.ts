import { orderFactory } from '../factories/orderFactory';

import { OrderInterface } from '../typings/order.interface';
import { StrategyStateInterface } from '../typings/strategy.interface';
import { getChildren, getSiblings, setStatus } from '../services/orderService';
import BarInterface from '../typings/bar.interface';
import { OrderStatusEnum } from '../typings/order.interface';
import { TradeStatusEnum, TradeInterface } from '../typings/trade.interface';

const markTradeCloseBySwing = (
  state: StrategyStateInterface,
  trade: TradeInterface,
  swingOrder: OrderInterface,
  bar: BarInterface,
): TradeInterface => {
  const order = orderFactory.clone(
    swingOrder,
    /* parent = */ undefined,
    trade.hash,
  );
  state.orders.set(order.hash, order);
  const orphans = getChildren(trade.openOrder, state);
  orphans.forEach(o => setStatus(o, OrderStatusEnum.CANCELED, bar));
  trade.closeOrder = order;
  return trade;
};

const handleTradeSwing = (
  state: StrategyStateInterface,
  order: OrderInterface,
  bar: BarInterface,
): TradeInterface => {
  const activeTrade = state.trades.find(
    t => t.status === TradeStatusEnum.ACTIVE,
  );
  if (!activeTrade) {
    return null;
  }
  const orphans = getChildren(activeTrade.openOrder, state);
  orphans.forEach(o => setStatus(o, OrderStatusEnum.CANCELED, bar));
  activeTrade.status = TradeStatusEnum.CLOSED;
  activeTrade.closeOrder = order;
  return activeTrade;
};

const handleTradeOpen = (
  state: StrategyStateInterface,
  order: OrderInterface,
): TradeInterface => {
  const trade = state.trades.find(t => t.hash === order.tradeHash);
  const children = orderFactory.createChildren(trade, order);
  if (!children || !children.length) {
    return null;
  }
  children.forEach(child => state.orders.set(child.hash, child));
  trade.status = TradeStatusEnum.ACTIVE;
  return trade;
};

const handleTradeClose = (
  state: StrategyStateInterface,
  order: OrderInterface,
  bar: BarInterface,
): void => {
  const trade = state.trades.find(t => t.hash === order.tradeHash);
  const siblings = getSiblings(order, state);
  if (!siblings || !siblings.length) {
    return;
  }
  siblings.forEach(o => setStatus(o, OrderStatusEnum.CANCELED, bar));
  trade.status = TradeStatusEnum.CLOSED;
  trade.closeOrder = order;
};

export {
  markTradeCloseBySwing,
  handleTradeSwing,
  handleTradeOpen,
  handleTradeClose,
};
