import { default as System } from '@core/system';

export default class TileChangeSystem extends System {
    constructor() {
      super()
    }

    initialize() {
        this.addHandler('REQUEST_TILE_CHANGE', (payload) => {
            this.changeTile(payload.entity)
        });
    }

    work() {
    }

    changeTile(entity) {
        if (!entity) {
            return;
        }
        
        this._cycleTileType(entity)
    }

    _cycleTileType(entity) {
        console.info(entity.getComponent('RenderComponent').imagePath);

        if (entity.getComponent('RenderComponent').imagePath == 'DIRT_5') {
            this._changeToGrass(entity)
        }
        else {
            this._changeToDirt(entity)
        }
    }

    _changeToDirt(entity) {
        entity.getComponent('RenderComponent').imagePath = 'DIRT_5';
    }

    _changeToGrass(entity) {
        entity.getComponent('RenderComponent').imagePath = 'GRASS_5';
    }
  }