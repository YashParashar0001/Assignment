const EventEmitter = require('events');

class TemperatureMonitor extends EventEmitter {
  constructor(initialTemperature = 20) {
    super();
    this._temperature = initialTemperature;
    this._isHigh = initialTemperature >= 40;
  }
  get temperature() {
    return this._temperature;
  }
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

const monitor = new TemperatureMonitor(25);

monitor.on('temperatureChanged', (data) => {
  console.log(`[Log] Temperature changed from ${data.oldTemp}°C to ${data.newTemp}°C`);
});

monitor.on('highTemperature', (temp) => {
  console.log(`🚨 ALERT: High temperature detected! Current: ${temp}°C`);
});

monitor.on('normalTemperature', (temp) => {
  console.log(`✅ INFO: Temperature back to normal. Current: ${temp}°C`);
});

console.log('--- Simulating changes ---');
monitor.temperature = 35; 
monitor.temperature = 42; 
monitor.temperature = 45; 
monitor.temperature = 38; 
