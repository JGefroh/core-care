import { default as System } from '@core/system';
import { default as itemManifest} from './item-manifest.js'
import ItemTool from '../../../genre/2d-farming/item-tool.js';
import ItemPlant from '../../../genre/2d-farming/item-plant.js';

export default class ItemConfigurationSystem extends System {
    constructor(config = {}) {
      super()

      this.send('REGISTER_ITEM_TYPE', { itemType: 'TOOL', itemClass: ItemTool})
      this.send('REGISTER_ITEM_TYPE', { itemType: 'PLANT', itemClass: ItemPlant})

      this.send('LOAD_ITEMS', {itemManifest: itemManifest})
    }
}