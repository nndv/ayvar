export const createScheduler = () => {
  let lastSchedule = null;

  return callback => {
    if (lastSchedule) {
      clearTimeout(lastSchedule);
    }

    lastSchedule = setTimeout(callback);
  };
};
