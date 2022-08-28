import React, { useEffect }  from 'react';
import { drawClock } from './clock';

import './App.css';

function App() {

  useEffect(() => {
    const canvas  = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    let radius = canvas.width / 2;
    ctx.translate(radius / 2, radius / 2);
    radius = radius * 0.90
    const clear = () => ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
    setInterval(drawClock(ctx, radius, clear), 1000);
  }, []);
  
  
  return (
    <div className="App">
      <main className="App-header">
        <div>
          <p>Current time:</p>
          <canvas id="canvas" width="600" height="1000"
            style={{backgroundColor: 'transparent'}}>
          </canvas>
        </div>
      </main>
    </div>
  );
}

export default App;
