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
      // Map timeOfDay to rotation angle where noon is top (-π/2)
      const angle = ((-timeOfDay / 24) * (2 * Math.PI)) - (Math.PI / 2);
      this.rotationAngle = angle;
    
      const x = this.centerX + this.radius * Math.cos(angle);
      const y = this.centerY - this.radius * Math.sin(angle);
    
      const pos = this.sun.getComponent('PositionComponent');
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