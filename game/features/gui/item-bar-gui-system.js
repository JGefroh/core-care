import { default as System } from '@core/system';

export default class ItemBarGuiSystem extends System {
    constructor(config = {}) {
      super()
      let itemCount = 0;

      this.addItemDescription();

      this.addHandler('SELECTED_ITEM_SLOT', (payload) => {
        this.updateItemSlots(payload.slot, payload.item)
      });

      this.addHandler('ADD_ITEM_TO_SLOTS', (payload) => {
        this.addItemSlot(itemCount, payload)
        itemCount+= 1;
      });
    }
  
    work() {

    };

    updateItemSlots(selectedItemSlot, item) {
        for (let i = 0; i < 9; i++) {
            this.send('GUI_UPDATE_PROPERTIES', {
                key: `gui-item-slot-${i - 1}`,
                value: {
                    imagePath: `${selectedItemSlot == i ? '/assets/images/item-slot-active.png' : '/assets/images/item-slot-inactive.png'}`,
                }
            })
        }
        this.updateItemDescription(item?.description)
    }


    addItemSlot(slotNumber, payload) {
        let baseYPosition = window.innerHeight - 72;
        let baseXPosition =  10;
        let size = 64;
        let spacing = 2;
        let yPosition = baseYPosition;
        let xPosition = baseXPosition + (slotNumber * size) + (spacing * slotNumber);


        let imagePath = payload.item.constructor.name == 'ItemTool' ?  `/assets/images/${payload.item.name.toLowerCase()}.png` :  `/assets/images/${payload.item.name.toLowerCase()}-5.png`
        let imageShape = payload.item.constructor.name == 'ItemTool' ? 'square' : 'rectangle';
        this.send('ADD_GUI_RENDERABLE', {
            key: `gui-item-slot-${slotNumber}`,
            xPosition: xPosition,
            yPosition: yPosition,
            width: size,
            height: size,
            fillStyle: 'rgba(0,0,0,0.6)',
            imagePath: '/assets/images/item-slot-inactive.png'
        })
        this.send('ADD_GUI_RENDERABLE', {
            key: `gui-item-slot-${slotNumber}-pic`,
            xPosition:  imageShape == 'square' ? xPosition + (size * 0.7) / 6: xPosition + (size * 0.8) / 3,
            yPosition: yPosition + 8,
            width: imageShape == 'square' ? (size * 0.8) : (size * 0.8) / 2,
            height: size * 0.8,
            fillStyle: 'rgba(0,0,0,0.6)',
            strokeStyle: 'rgba(79, 58, 0, 0.84)',
            lineWidth: 8,
            imagePath: imagePath
        })
    }

    updateItemDescription(text) {
        this.send('GUI_UPDATE_PROPERTIES', {
            key: `gui-item-slot-description`,
            value: {
                text: text
            }
        })
    }

    addItemDescription(text) {
        let baseYPosition = window.innerHeight - 110;
        let baseXPosition =  10;
        this.send('ADD_GUI_RENDERABLE', {
            key: `gui-item-slot-description`,
            xPosition: baseXPosition,
            yPosition: baseYPosition,
            width: 520,
            height: 32,
            fillStyle: 'rgba(0,0,0,0.6)',
            text: text,
            textOffsetY: 10,
            textOffsetX: 12,
            fontSize: 16,
            fontType: 'Pixellari'
        })
    }
}