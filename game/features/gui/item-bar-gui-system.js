import { default as System } from '@core/system';

export default class ItemBarGuiSystem extends System {
    constructor(config = {}) {
      super()
      this.addItemSlot(1)
      this.addItemSlot(2)
      this.addItemSlot(3)
      this.addItemSlot(4)
      this.addItemSlot(5)
      this.addItemSlot(6)
      this.addItemSlot(7)

      this.addHandler('SELECTED_ITEM_SLOT', (payload) => {
        this.updateItemSlots(payload)
      });
    }
  
    work() {

    };

    updateItemSlots(selectedItemSlot) {
        for (let i = 0; i < 9; i++) {
            this.send('GUI_UPDATE_PROPERTIES', {
                key: `gui-item-slot-${i}`,
                value: {
                    strokeStyle: selectedItemSlot == i ? 'rgba(0,255,0,0.6)' : 'rgba(0,0,0,0.6)',
                }
            })
        }
    }

    addItemSlot(slotNumber) {
        let baseYPosition = window.innerHeight - 72;
        let baseXPosition =  10;
        let size = 64;
        let spacing = 12;
        let yPosition = baseYPosition;
        let xPosition = baseXPosition + (slotNumber * size) + (spacing * slotNumber);


        this.send('ADD_GUI_RENDERABLE', {
            key: `gui-item-slot-${slotNumber}`,
            xPosition: xPosition,
            yPosition: yPosition,
            width: size,
            height: size,
            fillStyle: 'rgba(0,0,0,0.6)',
            strokeStyle: 'rgba(79, 58, 0, 0.84)',
            lineWidth: 8
        })
    }
}