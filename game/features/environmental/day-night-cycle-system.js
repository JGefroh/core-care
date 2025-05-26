import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import { default as SkyProgram } from '@game/features/environmental/sky/sky-program';

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
        { hour: 0,  skyColor: "rgba(11,12,16,1)", toneFilter: "rgba(0,0,0,0.87)" },       // midnight
        { hour: 4,  skyColor: "rgba(28,31,42,1)", toneFilter: "rgba(0,0,0,0.75)" },       // early dawn
        { hour: 6,  skyColor: "rgba(43,58,103,1)", toneFilter: "rgba(0,0,0,0.60)" },      // dawn
        { hour: 7,  skyColor: "rgba(166,126,97,1)", toneFilter: "rgba(0,0,0,0.50)"},                                    // sunrise
        { hour: 9,  skyColor: "rgba(252,161,125,1)", toneFilter: "rgba(0,0,0,0.40)" },                                   // morning
        { hour: 10, skyColor: "rgba(177,208,224,1)" },                                   // late morning
        { hour: 11, skyColor: "rgba(135,206,235,1)" },                                   // late morning
        { hour: 13, skyColor: "rgba(92,160,211,1)" },                                    // early afternoon
        { hour: 15, skyColor: "rgba(135,207,234,1)" },                                   // afternoon
        { hour: 17, skyColor: "rgba(252,204,102,1)", toneFilter: "rgba(255,128,64,0.40)" }, // golden hour
        { hour: 18, skyColor: "rgba(250,140,102,1)", toneFilter: "rgba(255,100,50,0.50)" },  // sunset
        { hour: 19, skyColor: "rgba(255,94,58,1)", toneFilter: "rgba(255,60,20,0.60)" },    // deep sunset
        { hour: 20, skyColor: "rgba(252,142,83,1)", toneFilter: "rgba(255,90,20,0.70)" },   // early night
        { hour: 21, skyColor: "rgba(166,126,97,1)", toneFilter: "rgba(255,90,20,0.80)"  },                                    // post-sunset warm
        { hour: 22, skyColor: "rgba(13,51,102,1)", toneFilter: "rgba(0,0,0,0.87)" },      // late evening
        { hour: 23, skyColor: "rgba(46,43,95,1)", toneFilter: "rgba(0,0,0,0.87)" },      // night
        { hour: 24, skyColor: "rgba(0,0,0,1)", toneFilter: "rgba(0,0,0,0.87)" },          // deep night
      ];
      
      this.wait = 500;

      this.addHandler('INPUT_RECEIVED', (payload) => {
        if (payload.action == 'previous_time_of_day') {
          this._gameStartTime -= 3600;
        }
        else if (payload.action == 'next_time_of_day') {
          this._gameStartTime += 3600;
        }
      })
    }

    initialize() {
      this.initializeGameClock(12, 60);

      this.send('REGISTER_MATERIAL', {
        materialId: 'sky',
        materialClass: SkyProgram,
        materialResolver: (renderCommand, context = {}) => {
          if (context.key == 'SKY') {
            return 'sky'
          }
        }
      })

      this.send("REQUEST_FULLSCREEN_TONE", {
        color: null
      });
    }
    
    work() {
      const currentColor = this.getSkyColor();

      // Apply tone overlay and sky background color
      let renderable = this.getTag('Renderable');
      this.forKeyedAs('SKY', (skyEntity) => {
        renderable.setEntity(skyEntity);
        renderable.setShapeColor(currentColor.color);

        // Apply the same sky color as a semi-transparent tone
        this.send("REQUEST_FULLSCREEN_TONE", {
          color: currentColor.sourceColor?.toneFilter?.replace(',1)', ', 0.3)') || null
        });
        
        this._core.publishData('TIME_OF_DAY', {
          currentGameTime: this._calculateCurrentTime()
        });
      });
      
    }

    initializeGameClock(startHour = 6, timeFactor = 60) {
      this.timeFactor = timeFactor;
      this._realStartTime = performance.now() / 1000; // real time in seconds
      this._gameStartTime = startHour * 3600; // game time in seconds (e.g., 6 AM = 21600s)
    }

    getSkyColor() {
      const hourFloat = this._calculateCurrentTime();
    
      // Extract hours from structured skyColors array
      const hours = this.skyColors.map(entry => entry.hour).sort((a, b) => a - b);
    
      // Find lower and upper bounding hours
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
    
      const colorAEntry = this.skyColors.find(entry => entry.hour === lowerHour);
      const colorBEntry = this.skyColors.find(entry => entry.hour === upperHour);
    
      const colorA = this.colors.parseRgba(colorAEntry.skyColor);
      const colorB = this.colors.parseRgba(colorBEntry.skyColor);
      const interpolated = this.colors.interpolateParsedRgba(colorA, colorB, t);
    
      // Publish time info (e.g. "14:05")
      this._core.publishData('DEBUG_TIME_OF_DAY', {
        currentGameTime: this._formatGameTime(hourFloat)
      });
    
      return {
        color: this.colors.rgbaToString(interpolated),
        sourceColor: colorAEntry,
        destinationColor: colorBEntry,
      }
    }

    _calculateCurrentTime() {
      const now = performance.now() / 1000;
      const realElapsed = now - this._realStartTime;
      const gameTime = this._gameStartTime + realElapsed * this.timeFactor;
      const hourFloat = (gameTime / 3600) % 24;

      return hourFloat;
    }

    _formatGameTime(hourFloat) {
      const hours = Math.floor(hourFloat);
      const minutes = Math.floor((hourFloat % 1) * 60);
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
      return formattedTime;
    }
  }