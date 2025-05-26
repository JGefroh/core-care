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
        { hour: 0,  skyColor: "rgba(11,12,16,1)", toneFilter: "rgba(0,0,0,0.87)" },
        { hour: 1,  skyColor: "rgba(11,12,16,1)", toneFilter: "rgba(0,0,0,0.87)" },
        { hour: 2,  skyColor: "rgba(11,12,16,1)", toneFilter: "rgba(0,0,0,0.87)" },
        { hour: 3,  skyColor: "rgba(11,12,16,1)", toneFilter: "rgba(0,0,0,0.87)" },
        { hour: 4,  skyColor: "rgba(28,31,42,1)", toneFilter: "rgba(0,0,0,0.87)" },

        { hour: 5,  skyColor: "rgba(70,60,110,1)", toneFilter: "rgba(70,60,110,0.75)" },   // predawn (cool)
        { hour: 6,  skyColor: "rgba(103,78,139,1)", toneFilter: "rgba(0,0,0,0.6)" },   // violet-blue
        { hour: 7,  skyColor: "rgba(180,130,90,1)", toneFilter: "rgba(0,0,0,0.35)" },  // warm amber
        { hour: 8,  skyColor: "rgba(230,170,120,1)", toneFilter: "rgba(0,0,0,0.2)" },  // sunrise glow
        { hour: 9,  skyColor: "rgba(252,200,150,1)", toneFilter: "rgba(0,0,0,0.1)" },  // soft peach
      
        { hour: 10, skyColor: "rgba(180,220,240,1)" }, // cooler blue
        { hour: 11, skyColor: "rgba(135,206,235,1)" },
        { hour: 12, skyColor: "rgba(135,206,235,1)" },
        { hour: 13, skyColor: "rgba(130,195,225,1)" },
        { hour: 14, skyColor: "rgba(125,185,215,1)" },

        { hour: 15, skyColor: "rgba(160,180,210,1)" },                            // softened
        { hour: 16, skyColor: "rgba(210,160,110,1)", toneFilter: "rgba(0,0,0,0.2)" }, // golden
        { hour: 17, skyColor: "rgba(190,120,80,1)", toneFilter: "rgba(0,0,0,0.35)" }, // orange-red
        { hour: 18, skyColor: "rgba(130,90,70,1)", toneFilter: "rgba(0,0,0,0.5)" },   // deep orange

        { hour: 19, skyColor: "rgba(43,58,103,1)", toneFilter: "rgba(0,0,0,0.5)" },
        { hour: 20, skyColor: "rgba(28,31,42,1)", toneFilter: "rgba(0,0,0,0.65)" },
        { hour: 21, skyColor: "rgba(11,12,16,1)", toneFilter: "rgba(0,0,0,0.77)" },
        { hour: 22, skyColor: "rgba(13,51,102,1)", toneFilter: "rgba(0,0,0,0.87)" },
        { hour: 23, skyColor: "rgba(46,43,95,1)", toneFilter: "rgba(0,0,0,0.87)" },
        { hour: 24, skyColor: "rgba(0,0,0,1)", toneFilter: "rgba(0,0,0,0.87)" }
      ];
      
      this.addHandler('INPUT_RECEIVED', (payload) => {
        if (payload.action == 'previous_time_of_day') {
          this._gameStartTime -= 100;
        }
        else if (payload.action == 'next_time_of_day') {
          this._gameStartTime += 100;
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
          color: currentColor.toneFilter
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
    
      const toneA = colorAEntry.toneFilter
        ? this.colors.parseRgba(colorAEntry.toneFilter)
        : { r: 0, g: 0, b: 0, a: 0 };

      const toneB = colorBEntry.toneFilter
        ? this.colors.parseRgba(colorBEntry.toneFilter)
        : { r: 0, g: 0, b: 0, a: 0 };

      const interpolatedTone = this.colors.interpolateParsedRgba(toneA, toneB, t);
      // Publish time info (e.g. "14:05")
      this._core.publishData('DEBUG_TIME_OF_DAY', {
        currentGameTime: this._formatGameTime(hourFloat)
      });
    
      return {
        color: this.colors.rgbaToString(interpolated),
        toneFilter: this.colors.rgbaToString(interpolatedTone),
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