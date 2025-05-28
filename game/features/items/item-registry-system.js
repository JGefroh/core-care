import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import ItemTool from './item-tool';
import ItemPlant from './item-plant';

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';

export default class ItemRegistrySystem extends System {
    constructor() {
      super()

      this.items = {}
    }

    initialize() {
        this.addHandler('LOAD_ITEMS', (payload) => {
            this.loadItems(payload.itemManifest);
        });
    }

    loadItems(itemDefinitions) {
        Object.entries(itemDefinitions).forEach(([key, value]) => {
            value.key = key;
            if (value.type == 'TOOL') {
                let item = this.loadTool(value)
                this.send('ADD_ITEM_TO_SLOTS', {item: item});
            }
            else if (value.type == 'PLANT') {
                let item = this.loadPlant(value);
                this.send('ADD_ITEM_TO_SLOTS', {item: item});
            }

        })
    }

    loadTool(itemDefinition) {
        let tool = new ItemTool(itemDefinition);
        this.items[itemDefinition.key] = tool;
        return tool;
    }

    loadPlant(itemDefinition) {
        let plant = new ItemPlant(itemDefinition);
        this.items[itemDefinition.key] = plant;
        return plant;
    }
}