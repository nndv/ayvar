export const createEventHub = () => {
  const hub = Object.create(null);

  return {
    emit,
    on,
    once,
    off
  };

  function emit(event, data) {
    (hub[event] || []).forEach(handler => {
      handler(data);
    });
  }

  function on(event, handler) {
    if (!hub[event]) hub[event] = [];
    hub[event].push(handler);
  }

  function once(event, handler) {
    const newHandler = () => {
      handler();
      off(event, newHandler);
    };
    on(event, newHandler);
  }

  function off(event, handler) {
    const i = (hub[event] || []).findIndex(h => {
      return h === handler;
    });
    if (i > -1) hub[event].splice(i, 1);
  }
};
