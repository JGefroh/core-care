import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';


export default class TileHoverGuiSystem extends System {
    constructor(config = {}) {
      super()
      this.regionTileSize = 32;
      this.createHoverEntity(0,0);
    }
  
    work() {
        let selectedRegion = this._core.getData('SELECTED_REGION');
        if (!selectedRegion) {
            return;
        }

        this.setHoverEntity(selectedRegion)
    };

    setHoverEntity(selectedRegion) {
        let entity = this._core.getEntityWithKey('region-tile-hover');
        entity.getComponent('PositionComponent').xPosition = selectedRegion.getComponent('PositionComponent').xPosition
        entity.getComponent('PositionComponent').yPosition = selectedRegion.getComponent('PositionComponent').yPosition
    }

    createHoverEntity(row, column) {
        let entity = new Entity({key: `region-tile-hover`});
        entity.addComponent(new PositionComponent({
            xPosition: column * this.regionTileSize,
            yPosition: row * this.regionTileSize,
            width: this.regionTileSize,
            height: this.regionTileSize
        }));
        entity.addComponent(new RenderComponent({
            width: this.regionTileSize,
            height: this.regionTileSize,
            shapeColor: 'rgba(0,0,0,0.7)',
            borderSize: 8,
            borderColor: 'rgba(29, 105, 245, 1)',
            renderLayer: 'TOP'
        }));

        this._core.addEntity(entity);
    }
}