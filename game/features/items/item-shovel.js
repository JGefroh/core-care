
class ItemShovel {
    constructor() {
    }

    canUse(context) {
        if (context.selectedRegion.getComponent('RenderComponent').imagePath?.indexOf('GRASS_') != -1) {
            // Temporary
            return true;
        }
    }

    onUse(system, selectedRegion) {
        system.send("REQUEST_TILE_CHANGE", { entity: selectedRegion, to: 'DIRT' })
    }
}

export default ItemShovel;