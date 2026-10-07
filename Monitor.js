const EventEmitter = require('events');
const http = require('http');

class TemperatureMonitor extends EventEmitter {
  constructor(initialTemperature = 20) {
    super();
    this._temperature = initialTemperature;
    this._isHigh = initialTemperature >= 40;
  }
  get temperature() { return this._temperature; }
  set temperature(newTemp) {
    const oldTemp = this._temperature;
    this._temperature = newTemp;
    if (oldTemp !== newTemp) {
      this.emit('temperatureChanged', { oldTemp, newTemp });
    }
    if (newTemp >= 40 && !this._isHigh) {
      this._isHigh = true;
      this.emit('highTemperature', newTemp);
    } else if (newTemp < 40 && this._isHigh) {
      this._isHigh = false;
      this.emit('normalTemperature', newTemp);
    }
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  let logs = [];
  const monitor = new TemperatureMonitor(25);
  monitor.on('temperatureChanged', (data) => {
    logs.push(`<p style="color: #555;">[Log] Temperature changed from <b>${data.oldTemp}°C</b> to <b>${data.newTemp}°C</b></p>`);
  });

  monitor.on('highTemperature', (temp) => {
    logs.push(`<p style="color: #d9534f; font-weight: bold; font-size: 1.1em;">🚨 ALERT: High temperature detected! Current: ${temp}°C</p>`);
  });

  monitor.on('normalTemperature', (temp) => {
    logs.push(`<p style="color: #5cb85c; font-weight: bold; font-size: 1.1em;">✅ INFO: Temperature back to normal. Current: ${temp}°C</p>`);
  });

  monitor.temperature = 35; 
  monitor.temperature = 42; 
  monitor.temperature = 45; 
  monitor.temperature = 38; 

  const htmlOutput = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Temperature Monitor Output</title>
      <style>
        body { font-family: system-ui, sans-serif; margin: 40px; background: #f9f9f9; color: #333; }
        .container { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
        h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; font-size: 24px; }
        .console { background: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Temperature Monitor Simulation</h1>
        <div class="console">
          <p style="color: #888; margin-top: 0;">--- Simulating changes ---</p>
          ${logs.join('')}
        </div>
      </div>
    </body>
    </html>
  `;

  res.end(htmlOutput);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
