import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import PlantComponent from './plant-component';

export default class PlantSystem extends System {
    constructor() {
      super()

      this.plantStages = {
        'PLANT_0': { key: 'PLANT_0', height: 32, next: 'PLANT_1'},
        'PLANT_1': { key: 'PLANT_1', height: 32, next: 'PLANT_2'},
        'PLANT_2': { key: 'PLANT_2', height: 48, next: 'PLANT_3'},
        'PLANT_3': { key: 'PLANT_3', height: 64, next: 'FINAL'},
        'FINAL': { key: 'FINAL', height: 64}
      }
      this.wait = 500;
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
      let plantHeight = 32 * (params.scale || 1);


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
        imagePath: 'PLANT_0',
        zIndex: regionYPosition,
        renderLayer: 'PROP',
        renderAlignment: 'bottom-center'
      }));
      entity.addComponent(new PlantComponent({
        type: type
      }));
      this._core.addEntity(entity);
    }

    advancePlant(entity) {
      let plantStage = this.plantStages[entity.getComponent('RenderComponent').imagePath]
      console.info(plantStage)
      if (plantStage && plantStage.next != 'FINAL') {
        let nextStage = this.plantStages[plantStage.next]
        entity.getComponent('RenderComponent').imagePath = nextStage.key
        entity.getComponent('RenderComponent').height = nextStage.height;
      }
      else if (plantStage?.next == 'FINAL') {
        let plantType = entity.getComponent('PlantComponent').type;
        entity.getComponent('RenderComponent').imagePath = plantType;
      }
    }
}