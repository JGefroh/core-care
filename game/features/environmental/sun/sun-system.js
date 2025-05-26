import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import Colors from '@game/engine/util/colors';
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';

export default class SunSystem extends System {
    constructor() {
      super();
      this.sun = null;
  
      this.centerX = 0;      // center of the sky dome
      this.centerY = 0;   // vertical origin for the arc
      this.radius = 500;     // how wide the arc is
      this.rotationAngle = -Math.PI / 2;; // radians
      this.rotationSpeed = 0.0015; // radians per tick

      this.sunriseHour = 6;
      this.sunsetHour = 19;
      this.sunriseAngle = Math.PI * 0.75;  // ~135°, top-left
      this.sunsetAngle  = Math.PI / 6;  // ~45°, top-right
    }
  
    initialize() {
      this.addSun(0, 0); // start at angle = 0
    }

    work() {
      const currentTime = this._core.getData('TIME_OF_DAY')?.currentGameTime;
      if (currentTime == null) {
        return;
      }

      if (!this.sun?.id) {
        this.sun = null;
        return;
      }
    
      this.rotateSun(currentTime);
    }

    rotateSun(timeOfDay) {
      const pos = this.sun.getComponent('PositionComponent');
    
      if (timeOfDay < this.sunriseHour || timeOfDay > this.sunsetHour) {
        pos.xPosition = -9999; // hide sun off-screen
        pos.yPosition = -9999;
        return;
      }
    
      // Normalize time within active range
      const t = (timeOfDay - this.sunriseHour) / (this.sunsetHour - this.sunriseHour);
    
      // Interpolate between sunrise and sunset angles
      const angle = this.sunriseAngle + t * (this.sunsetAngle - this.sunriseAngle);
    
      const x = this.centerX + this.radius * Math.cos(angle);
      const y = this.centerY - this.radius * Math.sin(angle); // Y flipped for screen coords
    
      pos.xPosition = x;
      pos.yPosition = y;
    }

    addSun(x, y) {
      let entity = new Entity();
      let size = 64;
  
      entity.addComponent(new PositionComponent({
        xPosition: x,
        yPosition: y,
        width: size,
        height: size,
      }));
  
      entity.addComponent(new RenderComponent({
        width: size,
        height: size,
        shape: 'circle',
        shapeColor: 'rgba(255, 242, 0, 1)',
        renderLayer: 'SKY_TOP'
      }));
  
      this._core.addEntity(entity);
      this.sun = entity;
    }
  }