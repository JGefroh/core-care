import { default as System } from '@core/system';

export default class TileChangeSystem extends System {
    constructor() {
      super()
    }

    initialize() {
        this.addHandler('REQUEST_TILE_CHANGE', (payload) => {
            this.changeTile(payload.entity, payload.to)
        });
    }

    work() {
    }

    changeTile(entity, to) {
        if (!entity || !to) {
            return;
        }
        
        this._changeTo(entity, to)
    }

    _changeTo(entity, to) {
        if (to == 'DIRT') {
            entity.getComponent('RenderComponent').imagePath = 'DIRT_5';
        }
        else if (to == 'GRASS') {
            entity.getComponent('RenderComponent').imagePath = 'GRASS_5';
        }
        else if (to == 'DIRT_TILLED') {
            entity.getComponent('RenderComponent').imagePath = 'DIRT_TILLED';
        }
        this.send('TILE_CHANGED', {entity: entity, to: to})
    }
  }