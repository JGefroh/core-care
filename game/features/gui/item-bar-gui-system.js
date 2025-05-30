import { default as System } from '@core/system';

export default class ItemBarGuiSystem extends System {
    constructor(config = {}) {
      super()
      let itemCount = 0;

      this.addHandler('SELECTED_ITEM_SLOT', (payload) => {
        this.updateItemSlots(payload)
      });

      this.addHandler('ADD_ITEM_TO_SLOTS', (payload) => {
        this.addItemSlot(itemCount, payload)
        itemCount+= 1;
      });
    }
  
    work() {

    };

    updateItemSlots(selectedItemSlot) {
        for (let i = 0; i < 9; i++) {
            this.send('GUI_UPDATE_PROPERTIES', {
                key: `gui-item-slot-${i - 1}`,
                value: {
                    strokeStyle: selectedItemSlot == i ? 'rgba(0,255,0,0.6)' : 'rgba(0,0,0,0.6)',
                }
            })
        }
    }

    addItemSlot(slotNumber, payload) {
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
            lineWidth: 8,
        })
        this.send('ADD_GUI_RENDERABLE', {
            key: `gui-item-slot-${slotNumber}-pic`,
            xPosition: xPosition + (size * 0.8) / 3,
            yPosition: yPosition + 8,
            width: (size * 0.8) / 2,
            height: size * 0.8,
            fillStyle: 'rgba(0,0,0,0.6)',
            strokeStyle: 'rgba(79, 58, 0, 0.84)',
            lineWidth: 8,
            imagePath: `/assets/images/${payload.item.name.toLowerCase()}-5.png`
        })
    }
}