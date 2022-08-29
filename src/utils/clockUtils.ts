import { NUM_CLOCKFACE_HOURS } from '../constants';
import { Time28 } from './toTime28';

export const getHourRad = (time: Time28) => {
  const { hour, minute, second } = time;

  return (
    (hour * Math.PI) / (NUM_CLOCKFACE_HOURS / 2) +
    (minute * Math.PI) / ((NUM_CLOCKFACE_HOURS / 2) * 60) +
    (second * Math.PI) / (360 * 60)
  );
};
