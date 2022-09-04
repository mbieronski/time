import moment from 'moment';

export const getStartWeek = (time: Date) => {
  // week starts Saturday at 12pm
  const t = moment(time);

  if (t.day() === 6 && t.hour() < 12) {
    t.subtract(1, 'day');
  }

  // roll back to most recent saturday
  while (t.day() !== 6) {
    t.subtract(1, 'day');
  }

  t.set('hour', 12);
  t.set('minute', 0);
  t.set('millisecond', 0);

  return t.toDate();
};
