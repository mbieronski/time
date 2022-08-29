import '@jest/globals';
import { toTime28 } from '../toTime28';

describe('Clock', () => {
  it('should convert 7 day time to 6 day time', () => {
    // Sunday
    let time = toTime28(new Date('2022-08-14T00:00:00.000'));

    expect(time.day).toBe(0);
    expect(time.hour).toBe(12);

    time = toTime28(new Date('2022-08-14T23:00:00.000'));

    expect(time.day).toBe(1);
    expect(time.hour).toBe(7);

    // Monday
    time = toTime28(new Date('2022-08-15T00:00:00.000'));

    expect(time.day).toBe(1);
    expect(time.hour).toBe(8);

    time = toTime28(new Date('2022-08-15T23:00:00.000'));

    expect(time.day).toBe(2);
    expect(time.hour).toBe(3);

    // Tuesday
    time = toTime28(new Date('2022-08-16T00:00:00.000'));

    expect(time.day).toBe(2);
    expect(time.hour).toBe(4);

    time = toTime28(new Date('2022-08-16T23:00:00.000'));

    expect(time.day).toBe(2);
    expect(time.hour).toBe(27);

    // Wednesday
    time = toTime28(new Date('2022-08-17T00:00:00.000'));

    expect(time.day).toBe(3);
    expect(time.hour).toBe(0);

    time = toTime28(new Date('2022-08-17T23:00:00.000'));

    expect(time.day).toBe(3);
    expect(time.hour).toBe(23);

    // Thursday
    time = toTime28(new Date('2022-08-18T00:00:00.000'));

    expect(time.day).toBe(3);
    expect(time.hour).toBe(24);

    time = toTime28(new Date('2022-08-18T23:00:00.000'));

    expect(time.day).toBe(4);
    expect(time.hour).toBe(19);

    // Friday
    time = toTime28(new Date('2022-08-19T00:00:00.000'));

    expect(time.day).toBe(4);
    expect(time.hour).toBe(20);

    time = toTime28(new Date('2022-08-19T23:00:00.000'));

    expect(time.day).toBe(5);
    expect(time.hour).toBe(15);

    // Saturday
    time = toTime28(new Date('2022-08-20T00:00:00.000'));

    expect(time.day).toBe(5);
    expect(time.hour).toBe(16);

    time = toTime28(new Date('2022-08-20T23:00:00.000'));

    expect(time.day).toBe(0);
    expect(time.hour).toBe(11);
  });

  it('should return minutes and seconds', () => {
    const time = toTime28(new Date('2022-08-23T15:00:00.000'));

    expect(time.minute).toEqual(expect.any(Number));
    expect(time.second).toEqual(expect.any(Number));
  });
});
