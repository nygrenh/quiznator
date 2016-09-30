const subscriptions = {};

let id = 0;

export const subscribe = (eventName, callback) => {
  if(typeof callback !== 'function') {
    throw new Error('Callback must me a function');
  }

  const subscriptionId = (id++).toString();

  subscriptions[eventName] = Object.assign({}, subscriptions[eventName] || {}, { [subscriptionId]: callback });

  return () => {
    delete subscriptions[eventName][subscriptionId];
  };
}

export const publish = (eventName, data) => {
  Object.keys(subscriptions[eventName] || {})
    .forEach(key => {
      subscriptions[eventName][key](data);
    });
}
