const manifest = {
    textures: {
        'DEV_NO_TEXTURE': { path: 'dev-no-texture.jpg' },
        'DIRT_0': { path: 'dirt-4.png' },
        'DIRT_1': { path: 'dirt-4.png' },
        'DIRT_2': { path: 'dirt-4.png' },
        'DIRT_3': { path: 'dirt-4.png' },
        'DIRT_4': { path: 'dirt-4.png' },
        'DIRT_5': { path: 'dirt-4.png' },
        'DIRT_6': { path: 'dirt-4.png' },
        'DIRT_7': { path: 'dirt-4.png' },
        'DIRT_8': { path: 'dirt-4.png' },
        'DIRT_TILLED': { path: 'dirt-tilled.png' },
        'GUARD_1': { path: 'guard-1.png'},
        'BG_MOUNTAIN': { path: 'mountains.png'},
        'BG_TREELINE': { path: 'treeline.png'},
        'SHOVEL': { path: 'shovel.png'}
    },
    props: {
      'CLOUD_1': { path: 'cloud-1.png' },
      'CLOUD_2': { path: 'cloud-2.png' },
      'SNOW_1': { path: 'snow-1.png' },
      'SNOW_3': { path: 'snow-3.png' },
      'SNOW_4': { path: 'snow-4.png' },
      'SUNFLOWER': { path: 'sunflower.png' },
      'DAISY': { path: 'daisy.png' },
      "PLANT_0": { path: 'plant-0.png'},
      "PLANT_1": { path: 'plant-1.png'},
      "PLANT_2": { path: 'plant-2.png'},
      "PLANT_3": { path: 'plant-3.png'},
      "HOUSE": { path: 'house.png'},
    }
}

addAsset('CARROT', 'carrot', 5)
addAsset('DAISY', 'daisy', 5)
addAsset('LETTUCE', 'lettuce', 5)
addAsset('CAULIFLOWER', 'cauliflower', 5)
addAsset('LAVENDER', 'lavender', 5)
addTilemap('GRASS', 'grass')

function addAsset(assetKey, assetFile, frameCount) {
  for(let i = 0; i < frameCount; i++) {
    manifest.props[`${assetKey}_${i+1}`] = { path: `${assetFile}-${i + 1}.png`};
  }
}


function addTilemap(key, name) {
  for(let i = 0; i < 9; i++) {
    manifest.props[`${key}_${i}`] = { path: `${name}-${i}.png`};
  }
}
export default manifest;