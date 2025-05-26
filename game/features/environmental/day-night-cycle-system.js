import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import Colors from '@game/engine/util/colors';
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';


export default class DayNightCycleSystem extends System {
    constructor() {
      super()
      this.colors = new Colors();
      this.timeFactor = 1.0 // 1 means every minute of real time is a minute of game time, 60 means every minute of game time is 60 minutes of real time.

      this.gameTime = 0;

      this.skyColors = [
        "rgba(11,12,16,1)",
        "rgba(28,31,42,1)",
        "rgba(43,58,103,1)",
        "rgba(166,126,97,1)",    // desaturated warm brownish-pink (high sky)
        "rgba(252,161,125,1)",
        "rgba(177,208,224,1)",
        "rgba(135,206,235,1)",
        "rgba(92,160,211,1)",
        "rgba(135,207,234,1)",  // daytime sky blue
        "rgba(252,204,102,1)",  // golden yellow (transition color)
        "rgba(250,140,102,1)",  // sunrise/sunset (reddish orange)
        "rgba(255,94,58,1)",    // deep orange-red at horizon
        "rgba(252,142,83,1)",   // orange
        "rgba(166,126,97,1)",    // desaturated warm brownish-pink (high sky)
        "rgba(13,51,102,1)",     // deep zenith blue
        "rgba(46,43,95,1)",
        "rgba(0,0,0,1)",
      ]
      this.currentStep = 0;
      this.currentColorIndex = Math.floor(Math.random() * this.skyColors.length);
      this.stepColor = null;
      this.nextColorIndex = 1;
      this.numberSteps = 10;
      this.wait = 500;

    }

    initialize() {
      // this.initializeGameClock(22, 60);
      // this.initializeGameClock(8, 60);
    }
    
    work() {
      const currentColor = this.getSkyColor();

      // Apply tone overlay and sky background color
      let renderable = this.getTag('Renderable');
      this.forKeyedAs('SKY', (skyEntity) => {
        renderable.setEntity(skyEntity);
        renderable.setShapeColor(currentColor);
    
        // Apply the same sky color as a semi-transparent tone
        this.send("REQUEST_FULLSCREEN_TONE", {
          color: currentColor.replace(',1)', ', 0.97)')
        });
      });
      
    }

    nextColor() {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.skyColors.length;
      this.nextColorIndex = (this.currentColorIndex + 1) % this.skyColors.length;
    }

    initializeGameClock(startHour = 6, timeFactor = 60) {
      this.timeFactor = timeFactor;
      this._realStartTime = performance.now() / 1000; // real time in seconds
      this._gameStartTime = startHour * 3600; // game time in seconds (e.g., 6 AM = 21600s)
    }

    getCurrentGameTime() {
      const now = performance.now() / 1000;
      const realElapsed = now - this._realStartTime;
      return this._gameStartTime + realElapsed * this.timeFactor;
    }

    getSkyColor() {
      const now = performance.now() / 1000;
      const realElapsed = now - this._realStartTime;
      const gameTime = this._gameStartTime + realElapsed * this.timeFactor;
      const hourFloat = (gameTime / 3600) % 24;
    
      const skyColorByHour = {
        0:  "rgba(11,12,16,1)",     // midnight
        4:  "rgba(28,31,42,1)",     // early dawn
        6:  "rgba(43,58,103,1)",    // dawn
        7:  "rgba(166,126,97,1)",   // sunrise
        9:  "rgba(252,161,125,1)",  // morning
        11: "rgba(135,206,235,1)",  // late morning
        13: "rgba(92,160,211,1)",   // early afternoon
        15: "rgba(135,207,234,1)",  // afternoon
        17: "rgba(252,204,102,1)",  // golden hour
        18: "rgba(250,140,102,1)",  // sunset
        19: "rgba(255,94,58,1)",    // deep sunset
        20: "rgba(46,43,95,1)",     // dusk
        22: "rgba(0,0,0,1)",        // late night
      };
    
      const hours = Object.keys(skyColorByHour).map(h => parseInt(h)).sort((a, b) => a - b);
    
      // Find lower and upper surrounding hours
      let lowerHour = hours[0];
      let upperHour = hours[0];
    
      for (let i = 0; i < hours.length; i++) {
        if (hourFloat >= hours[i]) {
          lowerHour = hours[i];
          upperHour = hours[(i + 1) % hours.length];
        }
      }
    
      const total = (upperHour > lowerHour)
        ? upperHour - lowerHour
        : (24 - lowerHour + upperHour); // wrap around midnight
    
      const elapsed = (hourFloat >= lowerHour)
        ? hourFloat - lowerHour
        : (24 - lowerHour + hourFloat); // wrap case
    
      const t = total === 0 ? 0 : elapsed / total;
    
      const colorA = this.colors.parseRgba(skyColorByHour[lowerHour]);
      const colorB = this.colors.parseRgba(skyColorByHour[upperHour]);
      const interpolated = this.colors.interpolateParsedRgba(colorA, colorB, t);
    
      return this.colors.rgbaToString(interpolated);
    }
  }