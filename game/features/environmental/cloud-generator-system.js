import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';


export default class CloudGeneratorSystem extends System {
    constructor() {
      super()
      this.addHandler('REQUEST_CLOUD', (payload) => {
        this._createCloud(xLimitMin, xLimitMax, yLimitMin, yLimitMax);
      });

      this.addHandler('REQUEST_CLOUD_FX', (payload) => {
        this._applyCloudFX(payload.entity)
      })
    }

    initialize() {
      for (let index = 0; index < 10; index++) {
        this._createRandomCloud(0, window.innerWidth, 0, 100);
        this._createRandomCloud(0, window.innerWidth, 0, 100);
      }
    }
    
    work() {
    }

    _createRandomCloud(xLimitMin, xLimitMax, yLimitMin, yLimitMax) {
      this.send('CREATE_PROP', {type: 'CLOUD_RANDOM', xPosition: `random(${xLimitMin}, ${xLimitMax})`, yPosition: `random(${yLimitMin}, ${yLimitMax})`, width: 30, height: 20, angleDegrees: 'random'});
    }

    _applyCloudFX(entity) {
      let vector = new VectorComponent({
        magnitude: 0.02,
        angle: Math.random() * 360
      });
      let timer = new TimerComponent({
        time: Math.random() * 5000,
        onEndEffect: () => {
          vector.removeAllVectors();
          vector.addVector(Math.random() * 0.02, Math.random() * 360)
        },
        shouldRepeat: true
      });

      entity.addComponent(vector)
      entity.addComponent(timer);
    }
  }