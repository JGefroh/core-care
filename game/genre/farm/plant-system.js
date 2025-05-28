import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';

export default class PlantSystem extends System {
    constructor() {
      super()
    }

    initialize() {
      this.addHandler('ADD_PLANT', (payload) => {
        console.info("ADD_PLANT", payload)
        this.addPlantAt(payload.entity, payload.type, payload);
      });
    }

    work() {
    }

    addPlantAt(region, type, params = {}) {
      let row = region.getComponent('RegionTileComponent').row;
      let regionXPosition = region.getComponent('PositionComponent').xPosition;
      let regionYPosition = region.getComponent('PositionComponent').yPosition;
      let plantWidth = 32 * (params.scale || 1);
      let plantHeight = 64 * (params.scale || 1);


      let entity = new Entity();
      entity.addComponent(new PositionComponent({
        xPosition: regionXPosition,
        yPosition: regionYPosition - 16,
        width: plantWidth,
        height: plantHeight,
      }));

      entity.addComponent(new RenderComponent({
        width: plantWidth,
        height: plantHeight,
        shape: 'rectangle',
        imagePath: type,
        zIndex: regionYPosition,
        renderLayer: 'PROP'
      }));
      this._core.addEntity(entity);
    }
}