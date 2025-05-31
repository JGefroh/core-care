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
      this.addHandler('ADVANCE_PLANT', (payload) => {
        this.advancePlantAt(payload.entity);
      });
      this.addHandler('HARVEST_PLANT', (payload) => {
        this.harvestPlantAt(payload.entity);
      });
    }

    work() {
      this.workForTag('Plantable', (tag, entity) => {
        this.advancePlant(entity);
      });
    }

    harvestPlantAt(region) {
      let row = region.getComponent('RegionTileComponent').row;
      let column = region.getComponent('RegionTileComponent').column;
      let entity = this._core.getEntityWithKey(`plant-${row}-${column}`)
      if (!entity) {
        return;
      }

      this._core.removeEntity(entity);
    }

    addPlantAt(region, type, params = {}) {
      let row = region.getComponent('RegionTileComponent').row;
      let column = region.getComponent('RegionTileComponent').column;
      let regionXPosition = region.getComponent('PositionComponent').xPosition;
      let regionYPosition = region.getComponent('PositionComponent').yPosition;
      let plantWidth = 32 * (params.scale || 1);
      let plantHeight = 64 * (params.scale || 1);


      let entity = new Entity({key: `plant-${row}-${column}`});
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

    advancePlantAt(region) {
      let row = region.getComponent('RegionTileComponent').row;
      let column = region.getComponent('RegionTileComponent').column;
      let entity = this._core.getEntityWithKey(`plant-${row}-${column}`)
      if (!entity) {
        return;
      }
      console.info(region, entity)

      this.advancePlant(entity, true)
    }
    advancePlant(entity, force) {
      let plant = entity.getComponent('PlantComponent');

      if ((force || plant.stageCurrent != 0) && plant.stageCurrent < plant.stageCount) {
        plant.stageCurrent += 1;
        entity.getComponent('RenderComponent').imagePath = `${plant.type}_${plant.stageCurrent}`
      }
    }
}