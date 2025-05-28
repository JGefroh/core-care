import { default as System } from '@core/system';
import { default as itemManifest} from './item-manifest.js'

export default class ItemConfigurationSystem extends System {
    constructor(config = {}) {
      super()

      this.send('LOAD_ITEMS', {itemManifest: itemManifest})
    }
}