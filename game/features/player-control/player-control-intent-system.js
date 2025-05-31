import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

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

      if (context.selectedItem.canUse(context)) {
        context.selectedItem.onUse(this, context.selectedRegion);
        this.send('INPUT_RECEIVED', {action: 'next_time_of_day', amount: 300})
      }
      else {
        this.send("PLAY_AUDIO", {
          audioKey: 'intent-reject.mp3',
          volume: 0.5
        })
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