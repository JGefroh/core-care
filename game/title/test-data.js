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
import PlayerControlComponent from '../features/player-control/player-control-component';
import CollisionComponent from '@game/engine/collision/collision-component';


export function createTestData() {
    createTree(window.innerWidth / 2, 300, 30, 100, true);
    createTree(window.innerWidth / 2 - 100, 300, 30, 100, false);
    createTree(window.innerWidth / 2 - 300, 300, 30, 100, false);
    createGuard(0, -128, 32);

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


function createGuard(x, y, tileSize) {
  let entity = new Entity();
  let position = new PositionComponent({
      xPosition: x,
      yPosition: y,
      width: tileSize,
      height: tileSize * 2
  });
  let render = new RenderComponent({
      width: tileSize,
      height: tileSize * 2,
      imagePath: 'GUARD_1'
  });
  let vector = new VectorComponent({
    maxMagnitude: 3,
    bleedAmount: 0.3
  });
  let control = new PlayerControlComponent({});
  let collision = new CollisionComponent({
    collisionGroup: 'character',
    collisionShape: 'circle',
  })
    entity.addComponent(collision);
    entity.addComponent(position);
    entity.addComponent(render);
    entity.addComponent(control);
    entity.addComponent(vector);
    Core.addEntity(entity);
}

function _randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}