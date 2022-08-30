import moment from 'moment';
import { GetTimesResult } from 'suncalc';
import { NUM_CLOCKFACE_HOURS, TIME } from './constants';
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
  const firstFace = time28.hour < NUM_CLOCKFACE_HOURS;

  const now24 = moment(TIME || new Date());
  const sunset =
    now24.isAfter(sunTimes.sunset) &&
    now24.day() !== moment(sunTimes.sunset).day()
      ? moment(sunTimes.sunset).add(1, 'day').toDate()
      : now24.isBefore(sunTimes.sunrise)
      ? moment(sunTimes.sunset).subtract(1, 'day').toDate()
      : sunTimes.sunset;

  const sunrise = moment(TIME || new Date()).isAfter(sunTimes.sunrise)
    ? moment(sunTimes.sunrise).add(1, 'day').toDate()
    : sunTimes.sunrise;

  const hourAngle = getHourRad(time28);

  const sunrise28 = toTime28(sunrise);
  const sunset28 = toTime28(sunset);
  const startTime28 = moment(sunrise).isBefore(sunset) ? sunrise28 : sunset28;
  const endTime28 = moment(sunrise).isBefore(sunset) ? sunset28 : sunrise28;

  let startAngle = getHourRad(startTime28);
  let endAngle = getHourRad(endTime28);

  if (startAngle > hourAngle && startTime28.hour > (firstFace ? 0 : 14)) {
    startAngle = 0;
  }

  if (endAngle < hourAngle && endTime28.hour > (firstFace ? 0 : 14)) {
    endAngle = 0;
  }

  const gradient = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(1, '#191130');
  ctx.fillStyle = gradient;

  // const duskGradient = ctx.createLinearGradient(
  //   -radius,
  //   -radius,
  //   Math.cos(startAngle) * radius * 2,
  //   Math.sin(startAngle) * radius * 2,
  // );
  // duskGradient.addColorStop(0.501, 'transparent');
  // duskGradient.addColorStop(0.5, 'orange'); //'rgba(50,50,100,0.6)'
  // duskGradient.addColorStop(0.4, 'transparent');

  // const dawnGradient = ctx.createLinearGradient(
  //   0,
  //   -radius,
  //   Math.cos(endAngle + 0.2 - Math.PI / 2) * radius,
  //   Math.sin(endAngle + 0.2 - Math.PI / 2) * radius,
  // );
  // dawnGradient.addColorStop(0.501, 'transparent');
  // dawnGradient.addColorStop(0.5, 'rgba(50,50,100,0.6)');
  // dawnGradient.addColorStop(0.4, 'transparent');

  ctx.beginPath();
  ctx.rotate(Math.PI / -2);
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.fill();
  ctx.rotate(Math.PI / 2);

  // ctx.moveTo(0, 0);

  // ctx.fillStyle = duskGradient;

  // ctx.beginPath();
  // ctx.rotate(Math.PI / -2);
  // ctx.moveTo(0, 0);
  // ctx.arc(0, 0, radius, startAngle - 0.2, startAngle + 0.2);
  // ctx.fill();
  // ctx.rotate(Math.PI / 2);
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
