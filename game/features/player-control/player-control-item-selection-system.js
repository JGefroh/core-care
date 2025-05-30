import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

export default class PlayerControlItemSelectionSystem extends System {
    constructor() {
      super()

      this.itemSlots = [
      ]

      this.selectedItem = null;

      this.addHandler('INPUT_RECEIVED', (payload = {}) => {
        if (payload.action?.indexOf('select_item_slot') >= 0) {
          this.handleItemSlotSelection(payload);
        }
      });

      this.addHandler('ADD_ITEM_TO_SLOTS', (payload) => {
        this.itemSlots.push(payload.item);
        this.selectedItem = this.itemSlots[this.itemSlots.length - 1]
        this._core.publishData('SELECTED_ITEM', this.selectedItem)

      })

    }

    handleItemSlotSelection(payload) {
      let parts = payload.action?.split('_') || [];
      let stringInt = parts[parts.length - 1];

      if (!stringInt) { return;  }

      let selectedItemSlot = parseInt(stringInt) - 1;
      this.selectedItem = this.itemSlots[selectedItemSlot];
      this._core.publishData('SELECTED_ITEM', this.selectedItem)
      this._core.send('SELECTED_ITEM_SLOT', stringInt)
    }
    
    work() {
    };
  }