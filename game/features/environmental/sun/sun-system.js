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
      super()
    }

    initialize() {
        this.addSun(-200, -473);
    }
    
    work() {
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
    }
  }