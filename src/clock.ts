import moment from 'moment';
import { GetTimesResult } from 'suncalc';
import { BACKGROUND_COLOR, NUM_CLOCKFACE_HOURS, TIME } from './constants';
import { getHourRad } from './utils/clockUtils';
import { toTime28 } from './utils/toTime28';

const TEXT_COLOR = '#C8D9DB';
const HAND_COLOR = '#678184';
const SECOND_HAND_COLOR = '#0DAFC4';

export const drawClock =
  (ctx: CanvasRenderingContext2D, radius, clear, sunTimes?: GetTimesResult) =>
  () => {
    clear();
    sunTimes && drawLightMap(ctx, radius, sunTimes);
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawMinuteNumbers(ctx, radius);
    drawTime(ctx, radius);
    drawWeek(ctx, radius);
  };

function drawWeek(ctx: CanvasRenderingContext2D, radius: number) {
  const day = toTime28().day;
  ctx.beginPath();
  ctx.translate(0, radius + 50);
  ctx.strokeStyle = TEXT_COLOR;
  for (let i = 0; i < 6; i++) {
    const x = -radius + (radius / 3) * i;
    const width = radius / 3;
    const height = (radius * 2) / 6;
    if (!i || i === 5) {
      ctx.fillStyle = `rgba(255,255,255,0.2)`;
      ctx.fillRect(x, 0, radius / 3, height);
    }

    if (i === day) {
      ctx.fillStyle = TEXT_COLOR;
      ctx.arc(x + radius / 6, height / 2, width / 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.strokeRect(x, 0, width, height);
  }
  ctx.translate(0, -(radius + 50));
  ctx.closePath();
}

function drawLightMap(
  ctx: CanvasRenderingContext2D,
  radius: number,
  sunTimes: GetTimesResult,
) {
  const time28 = toTime28();
  const now = moment(TIME || new Date());

  const sunrise = moment(sunTimes.sunrise);
  const sunset = moment(sunTimes.sunset);
  const sunrise28 = toTime28(sunrise.toDate());
  const sunset28 = toTime28(sunset.toDate());

  let startAngle = getHourRad(sunrise28);
  let endAngle = getHourRad(sunset28);
  if (sunrise.isBefore(now) && sunrise28.face !== time28.face) {
    // prev face
    console.log('1');
    startAngle =
      sunset.isAfter(now) || sunset28.face === time28.face ? endAngle : 0;
    const nextSunrise = toTime28(sunrise.add(1, 'days').toDate());
    endAngle = getHourRad(nextSunrise.face === time28.face ? nextSunrise : 0);
  } else if (sunrise.isAfter(now) && sunrise28.face !== time28.face) {
    // next face
    console.log('2');
    startAngle = getHourRad(toTime28(sunset.subtract(1, 'days').toDate()));
    endAngle = 0;
  } else if (sunset.isBefore(now) && sunset28.face !== time28.face) {
    // prev face
    console.log('3'); //'2022-09-05T21:00:00.000' else/if
    startAngle = getHourRad(toTime28(sunrise.add(1, 'days').toDate()));
    endAngle = getHourRad(toTime28(sunset.add(1, 'days').toDate()));
  } else if (sunset.isAfter(now) && sunset28.face !== time28.face) {
    // next face
    startAngle = 0;
    endAngle = getHourRad(sunrise28);
    console.log('4');
  }

  if (sunrise28.face === sunset28.face && sunrise28.face === time28.face) {
    // 0 to sunrise, sunset to 0
    console.log('5');
    startAngle = getHourRad(sunset28);
    endAngle = 0; // toTime28(sunrise.add(1, 'days').toDate());
  }

  const gradient = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
  gradient.addColorStop(0.4, 'transparent');
  gradient.addColorStop(1, '#191130');

  const reverseGradient = ctx.createRadialGradient(
    0,
    0,
    radius * 0.2,
    0,
    0,
    radius,
  );
  reverseGradient.addColorStop(0.45, BACKGROUND_COLOR);
  reverseGradient.addColorStop(0.45001, 'transparent');

  const duskGradient = ctx.createLinearGradient(
    -radius,
    -radius,
    radius,
    radius,
  );
  duskGradient.addColorStop(0.501, 'transparent');
  duskGradient.addColorStop(0.5, 'rgba(50,50,100,0.6)');
  duskGradient.addColorStop(0.4, 'transparent');

  const dawnGradient = ctx.createLinearGradient(
    -radius,
    -radius,
    radius,
    radius,
  );
  dawnGradient.addColorStop(0.501, 'transparent');
  dawnGradient.addColorStop(0.5, 'rgba(0,95,150,0.3)');
  dawnGradient.addColorStop(0.4, 'transparent');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.rotate(Math.PI / -2);
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.fill();
  ctx.rotate(Math.PI / 2);

  // dusk arc
  if (startAngle !== 0) {
    ctx.moveTo(0, 0);

    ctx.fillStyle = duskGradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(startAngle + (3 * Math.PI) / 4);
    // ctx.fillRect(-radius, -radius, 2 * radius, 2 * radius);
    ctx.arc(0, 0, radius, (3 * Math.PI) / 4 - 0.2, (3 * Math.PI) / 4 + 0.2);
    ctx.fill();
    ctx.rotate(-startAngle - (3 * Math.PI) / 4);
  }

  // dawn arc
  if (endAngle !== 0) {
    ctx.moveTo(0, 0);

    ctx.fillStyle = dawnGradient;
    ctx.beginPath();
    ctx.rotate(endAngle - Math.PI / 4);
    ctx.moveTo(0, 0);
    // ctx.fillRect(-radius, -radius, 2 * radius, 2 * radius);
    ctx.arc(0, 0, radius, -Math.PI / 4 - 0.2, -Math.PI / 4 + 0.2);
    ctx.fill();
    ctx.rotate(-endAngle + Math.PI / 4);
  }

  ctx.fillStyle = reverseGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.rotate(Math.PI / -2);
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.rotate(Math.PI / 2);
}

function drawFace(ctx: CanvasRenderingContext2D, radius: number) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'transparent';
  ctx.fill();
  grad = ctx.createRadialGradient(0, 0, radius * 0.97, 0, 0, radius * 1.02);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.05;
  ctx.stroke();
}

function drawNumbers(ctx: CanvasRenderingContext2D, radius: number) {
  var ang;
  var num;
  ctx.font = radius * 0.15 + 'px arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = TEXT_COLOR;
  const secondRotatation = toTime28().hour > 13;
  for (num = 0; num < NUM_CLOCKFACE_HOURS; num++) {
    ang = num * (Math.PI / (NUM_CLOCKFACE_HOURS / 2));
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.65);
    ctx.rotate(-ang);
    ctx.fillText((secondRotatation ? num + 14 : num).toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.65);
    ctx.rotate(-ang);
  }
}

function drawMinuteNumbers(ctx: CanvasRenderingContext2D, radius) {
  var ang;
  var num;
  ctx.font = radius * 0.05 + 'px arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = TEXT_COLOR;
  for (num = 1; num <= 12; num++) {
    ang = num * (Math.PI / 6);
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    if (num % 3) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.01, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.fillText((num * 5).toString(), 0, 0);
    }
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx: CanvasRenderingContext2D, radius: number) {
  const time = toTime28();
  const { minute, second } = time;

  //hour
  const hourAngle = getHourRad(time);
  drawHand(ctx, hourAngle, radius * 0.5, radius * 0.04, HAND_COLOR);
  //minute
  const minuteAngle = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.04, HAND_COLOR);
  // second
  const secondAngle = (second * Math.PI) / 30;
  drawHand(ctx, secondAngle, radius * 0.9, radius * 0.01, SECOND_HAND_COLOR);

  // center circle
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
  ctx.fillStyle = HAND_COLOR;
  ctx.fill();
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  pos,
  length,
  width,
  color = '#333',
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
