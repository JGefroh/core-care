import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';

export default class ItemRegistrySystem extends System {
    constructor() {
      super()

      this.items = {}
      this.itemTypes = {};
    }

    initialize() {
        this.addHandler('REGISTER_ITEM_TYPE', (payload) => {
            this.itemTypes[payload.itemType] = payload.itemClass;
        });

        this.addHandler('LOAD_ITEMS', (payload) => {
            this.loadItems(payload.itemManifest);
        });
    }

    loadItems(itemDefinitions) {
        Object.entries(itemDefinitions).forEach(([key, value]) => {
            value.key = key;
            let itemClass = this.itemTypes[value.type];
            if (itemClass) {
                let item = new itemClass(value)
                this.items[value.key] = item;
                this.send('ADD_ITEM_TO_SLOTS', {item: item});
            }
        })
    }
}