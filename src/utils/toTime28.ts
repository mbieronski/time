import { TIME } from '../constants';

export type Time28 = {
  day: number; // 0 - 5
  hour: number; // 0 - 27
  minute: number; // 0 - 59
  second: number; // 0 - 59
};

export function toTime28(date: Date = TIME || new Date()): Time28 {
  const day = date.getDay();
  const hr = date.getHours();
  let sixDay: number;
  let sixHour: number;

  const offset = day * 4 + 16;
  const re = offset % 24;
  const div = Math.floor(offset / 28);
  const breakpoint = div ? re - 4 : re;

  if (!breakpoint || hr < breakpoint) {
    sixDay = day < 4 ? day : day - 1;
    const hrOff = (12 + -4 * day) % 28;
    sixHour = hr + (hrOff < 0 ? hrOff + 28 : hrOff);
  } else {
    sixDay = (day < 2 || day === 6 ? day + 1 : day) % 7;
    sixHour = hr - (Math.abs(16 + 4 * day) % 28);
  }

  return {
    day: sixDay,
    hour: sixHour,
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}
