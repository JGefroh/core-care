import { default as System } from '@core/system';
import { default as assetManifest} from './asset-manifest.js'
import { default as mapEmpty} from '@game/specifics/maps/map-empty.js'

export default class AssetConfigurationSystem extends System {
    constructor(config = {}) {
      super()

      this.send('LOAD_ASSETS', {assetManifest: assetManifest})
      if (config.skipMapLoad) {
        return;
      }
      this.send('LOAD_MAP', {...mapEmpty, xPosition: window.innerWidth / 2, yPosition: window.innerHeight/2})
    }
}