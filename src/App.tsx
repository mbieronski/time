import React, { useEffect, useState } from 'react';
import SunCalc, { GetTimesResult } from 'suncalc';
import padStart from 'lodash/padStart';

import './App.css';
import { drawClock } from './clock';
import { TIME } from './constants';
import { toTime28 } from './utils/toTime28';

function App() {
  const [position, setPosition] = useState<GetTimesResult>(null);
  const [time28, setTime28] = useState(toTime28(new Date()));

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    let radius = canvas.width / 2;
    ctx.resetTransform();
    ctx.translate(radius, radius);
    radius = radius * 0.9;

    const clear = () =>
      ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

    const draw = drawClock(ctx, radius, clear, position);

    const interval = setInterval(() => {
      setTime28(toTime28(new Date()));
      draw();
    }, 1000);

    if (!position && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setPosition(
            SunCalc.getTimes(
              TIME || new Date(),
              pos.coords.latitude,
              pos.coords.longitude,
            ),
          ),
        () =>
          alert(
            'Enable Location services for your browser to get additional features',
          ),
      );
    }

    return () => clearInterval(interval);
  }, [position]);

  return (
    <div className="App">
      <main className="App-header">
        <div style={{ width: '100%' }}>
          <p>
            Current time:{' '}
            {`${time28.hour}:${padStart(
              String(time28.minute),
              2,
              '0',
            )}:${padStart(String(time28.second), 2, '0')}`}
          </p>
          <canvas
            id="canvas"
            width={Math.min(document.body.clientWidth, 600)}
            height="1000"
            style={{ backgroundColor: 'transparent' }}
          ></canvas>
        </div>
      </main>
    </div>
  );
}

export default App;
