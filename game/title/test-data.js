import '@core/component';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js';
import '@core/tag';

import '@game/title/font-loader.js';

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';
import LightSourceComponent from '@game/engine/lighting/light-source-component';

export function createTestData() {
    createTree(window.innerWidth / 2, 300, 30, 100, true);
    createTree(window.innerWidth / 2 - 100, 300, 30, 100, false);
    createTree(window.innerWidth / 2 - 300, 300, 30, 100, false);

}


function createTree(x, y, width, height, addLight) {
    let entity = new Entity();
    let position = new PositionComponent({
        xPosition: x,
        yPosition: y,
        width: width,
        height: height
    });
    let render = new RenderComponent({
        shapeColor: 'rgba(101,67,33,1)',
        width: width,
        height: height
    });

      let light = new LightSourceComponent({
        maxDistance: 300,
        lightType: 'point'
      })

      entity.addComponent(position);
      entity.addComponent(render);
      if (addLight) {
        entity.addComponent(light);
      }

      Core.addEntity(entity);
}

function _randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}