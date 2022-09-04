import moment from 'moment';

export const getEndWeek = (time: Date) => {
  // week starts Saturday at 12pm
  const t = moment(time);

  if (t.day() === 6 && t.hour() > 12) {
    t.add(1, 'day');
  }

  // roll forward to upcoming saturday
  while (t.day() !== 6) {
    t.add(1, 'day');
  }

  t.set('hour', 11);
  t.set('minute', 59);
  t.set('millisecond', 999);

  return t.toDate();
};
