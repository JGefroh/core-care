import { default as System } from '@core/system';

export default class MouseRegionSelectSystem extends System {
    constructor() {
      super()
      this.lastSelectedRegionEntity = null;
      this.lastSelectedRegionEntityDetails = null;
    }

    initialize() {
    }

    work() {
      let cursorCoordinates = this._core.getData('CURSOR_COORDINATES');
      if (!cursorCoordinates) { return; }

      this.getClosestRegion(cursorCoordinates.world)
    }

    getClosestRegion(worldCoordinates) {
      this.send('GET_CLOSEST_REGION', {
        xPosition: worldCoordinates.xPosition,
        yPosition: worldCoordinates.yPosition,
        callback: (region) => {
          this.selectRegion(region);
        }
      })
    }

    selectRegion(region) {
      if (region) {
        this._setSelected(this.lastSelectedRegionEntity, false)
        this._setSelected(region, true)
      }
    }

    _setSelected(regionEntity, isSelected) {
      if (!regionEntity) {
        return;
      }
      if (isSelected) {
        this.lastSelectedRegionEntity = regionEntity
        this.lastSelectedRegionEntityDetails = {
          shapeColor: regionEntity.getComponent('RenderComponent').shapeColor,
          imagePath: regionEntity.getComponent('RenderComponent').imagePath
        }

        regionEntity.getComponent('RenderComponent').shapeColor = 'rgba(255,0,0,1)';
        regionEntity.getComponent('RenderComponent').imagePath = null;
      }
      else if (this.lastSelectedRegionEntityDetails) {
        regionEntity.getComponent('RenderComponent').shapeColor = this.lastSelectedRegionEntityDetails.shapeColor;
        regionEntity.getComponent('RenderComponent').imagePath = this.lastSelectedRegionEntityDetails.imagePath;
      }

    }
  }