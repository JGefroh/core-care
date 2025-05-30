import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import PlantComponent from './plant-component';

export default class PlantSystem extends System {
    constructor() {
      super()

      this.plantStages = {
      }
      this.wait = 50;
    }

    initialize() {
      this.addHandler('ADD_PLANT', (payload) => {
        this.addPlantAt(payload.entity, payload.type, payload);
      });
    }

    work() {
      this.workForTag('Plantable', (tag, entity) => {
        this.advancePlant(entity);
      });
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
        yPosition: regionYPosition,
        width: plantWidth,
        height: plantHeight,
      }));

      entity.addComponent(new RenderComponent({
        width: plantWidth,
        height: plantHeight,
        shape: 'rectangle',
        imagePath: `${type}_1`,
        zIndex: regionYPosition,
        renderLayer: 'PROP',
        renderAlignment: 'bottom-center'
      }));
      entity.addComponent(new PlantComponent({
        type: type,
        stageCount: params.stageCount,
        stageCurrent: 0
      }));
      this._core.addEntity(entity);

      
      this.send("PLAY_AUDIO", {
        audioKey: 'planting.mp3',
        volume: 0.8
      })
    }

    advancePlant(entity) {
      let plant = entity.getComponent('PlantComponent');

      if (plant.stageCurrent < plant.stageCount) {
        plant.stageCurrent += 1;
        entity.getComponent('RenderComponent').imagePath = `${plant.type}_${plant.stageCurrent}`
      }
    }
}