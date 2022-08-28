/**
 * JS DATE 
 * 0-6 : Sun-Sat
 * 
 * 6/28 DATE 2nd weekend day to first weekend day with wednesday 0:00 convergence
 * Day 0: 6-12:00 to 0-16:00
 * Day 1: 0-16:00 to 1-20:00
 * Day 2: 1-20:00 to 3-00:00
 * Day 3: 3-00:00 to 4-04:00
 * Day 4: 4-04:00 to 5-08:00
 * Day 5: 5-08:00 to 6:12:00
 * 
 * 
 *   switch (day) {
    case 0:
      if (hr < 16) {
        sixDay = 0;
        sixHour = hr + 12
      } else {
        sixDay = 1;
        sixHour = hr - 16;
      }
      break;
    case 1:
      if (hr < 20) {
        sixDay = 1;
        sixHour = hr + 8;
      }
      else {
        sixDay = 2;
        sixHour = hr - 20;
      }
      break;
    case 2:
      sixDay = 2;
      sixHour = hr + 4;
      break;
    case 3:
      sixDay = 3;
      sixHour = hr;
      break;
    case 4:
      if (hr < 4) {
        sixDay = 3;
        sixHour = hr + 24;
      }
      else {
        sixDay = 4;
        sixHour = hr - 4;
      }
      break;
    case 5:
      if (hr < 8) {
        sixDay = 4;
        sixHour = hr + 20;
      }
      else {
        sixDay = 5;
        sixHour = hr - 8;
      }
      break;
    case 6:
      if (hr < 12) {
        sixDay = 5;
        sixHour = hr + 16;
      } else {
        sixDay = 0;
        sixHour = hr - 12;
      }
      break;
  }
 */

const NUM_HOURS = 14;
const TEXT_COLOR = '#C8D9DB';
const HAND_COLOR = '#678184';
const SECOND_HAND_COLOR = '#0DAFC4';

function get28HourTime() {
  const date = new Date();
  const day = date.getDay();
  const hr = date.getHours();
  let sixDay;
  let sixHour;

  const offset = ((day * 4) + 16);
  const re = offset % 24;
  const div = Math.floor(offset / 28);
  const breakpoint = div ? re - 4 : re;

  if (!breakpoint || hr < breakpoint) {
    sixDay = day < 4 ? day : day - 1;
    const hrOff = (12 + (-4 * day)) % 28;
    sixHour = hr + (hrOff < 0 ? hrOff + 28 : hrOff);
  } else {
    sixDay = (day < 2  || day === 6 ? day + 1 : day) % 7;
    sixHour = hr - (Math.abs(16 + (4 * day)) % 28);
  }


  return {
    day: sixDay,
    hour: sixHour,
    minute: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}



export function drawClock(ctx: CanvasRenderingContext2D, radius, clear) { return () => {
  clear();
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawMinuteNumbers(ctx, radius);
  drawTime(ctx, radius);
  drawWeek(ctx, radius);
  }
}

function drawWeek(ctx: CanvasRenderingContext2D, radius: number) {
  const day = get28HourTime().day;
  ctx.beginPath();
  ctx.translate(0, radius + 50);
  ctx.strokeStyle = TEXT_COLOR;
  for (let i = 0; i < 6; i++) {
    const x = (-radius) + (radius/3) * i;
    const width = radius / 3;
    const height = radius * 2 / 6;
    if (!i || i === 5) {
      ctx.fillStyle = `rgba(255,255,255,0.2)`;
      ctx.fillRect(x,0,radius/3, height);
    }
    
    if (i === day) {
      ctx.fillStyle = TEXT_COLOR;
      ctx.arc(x + radius / 6, height / 2, width / 4, 0, 2*Math.PI);
      ctx.fill();
    }
    ctx.strokeRect(x, 0, width, height);
  }
  ctx.translate(0, -(radius + 50));
  ctx.closePath();
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'transparent';
  ctx.fill();
  grad = ctx.createRadialGradient(0,0,radius*0.97, 0,0,radius*1.02);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.05;
  ctx.stroke();

}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  ctx.fillStyle = TEXT_COLOR;
  const secondRotatation = get28HourTime().hour > 12;
  for(num = 0; num < NUM_HOURS; num++) {
    ang = num  * (Math.PI / (NUM_HOURS / 2));
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.65);
    ctx.rotate(-ang);
    ctx.fillText((secondRotatation ? num + 14 : num).toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.65);
    ctx.rotate(-ang);
  }
}
function drawMinuteNumbers(ctx: CanvasRenderingContext2D, radius) {
  var ang;
  var num;
  ctx.font = radius*0.05 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  ctx.fillStyle = TEXT_COLOR;
  for(num = 1; num <= 12; num++){
    ang = num * (Math.PI / 6);
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    if (num % 3) {
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.fillText((num * 5).toString(), 0, 0);
    }
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour=get28HourTime().hour%NUM_HOURS;
    hour=(hour*Math.PI/ (NUM_HOURS / 2))+
    (minute*Math.PI/((NUM_HOURS / 2)*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.04, HAND_COLOR);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.04, HAND_COLOR);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.01, SECOND_HAND_COLOR);

    // center circle
    ctx.beginPath();
    ctx.arc(0, 0, radius*0.05, 0, 2*Math.PI);
    ctx.fillStyle = HAND_COLOR;
    ctx.fill();
}

function drawHand(ctx: CanvasRenderingContext2D, pos, length, width, color = '#333') {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}