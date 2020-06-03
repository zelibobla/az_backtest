/**
 * @link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/template_strings
 */
const renderString = (strings, ...keys) => {
  return function(...values) {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach(function(key, i) {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
};

export { renderString };
