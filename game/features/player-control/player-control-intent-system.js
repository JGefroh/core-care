import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import ItemShovel from '../items/item-shovel';
import ItemSeed from '../items/item-seed';

export default class PlayerControlIntentSystem extends System {
    constructor() {
      super()

      this.addHandler('PLAYER_INTENT', (payload) => {
        this.handlePlayerIntent(payload)
      });
    }

    work() {}
    
    handlePlayerIntent(payload) {
      let context = this.getContext();

      if (!context.selectedItem || !context.selectedRegion) {
        return;
      } 

      if (context.selectedItem == 'SHOVEL') {
        if (new ItemShovel().canUse(context)) {
          new ItemShovel().onUse(this, context.selectedRegion);
        };
      }
      else if (context.selectedItem == 'SEED') {
        if (new ItemSeed().canUse(context)) {
          new ItemSeed().onUse(this, context.selectedRegion, 'SUNFLOWER');
        };
      }
    };


    getContext() {
      return {
        selectedItem: this._core.getData("SELECTED_ITEM"),
        selectedRegion: this._core.getData('SELECTED_REGION')
      }
    }

    getAssociatedTiles(selectedRegion) {
      return {
        selectedTile: selectedRegion // temporary until I have a specific tile object
      }
    }

    handleShovelAction() {
    }
  }