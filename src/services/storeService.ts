import { Record } from 'immutable';

const Storage = Record({
  strategies: {},
  keys: [],
});

const storage = Storage({
  strategies: {},
  keys: [],
});

const store = {
  setStrategyState: (key, value) => {
    storage.strategies[key] = value;
    storage.keys.push(key);
  },
  getStrategyState: key => storage.strategies[key],
  [Symbol.iterator]: () => {
    const keys = Object.keys(storage.strategies);
    return {
      current: 0,
      last: keys.length - 1,
      next() {
        if (this.current <= this.last) {
          const key = keys[this.current];
          this.current += 1;
          return {
            done: false,
            value: { key, state: store.getStrategyState(key) },
          };
        } else {
          return { done: true };
        }
      },
    };
  },
};

export { store };
