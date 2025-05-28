
class ItemSeed {
    constructor() {
    }

    canUse(context) {
        console.info("HM", context.selectedRegion)
        if (context.selectedRegion.getComponent('RenderComponent').imagePath?.indexOf('DIRT_') != -1) {
            return true;
        }
    }

    onUse(system, selectedRegion, plantType) {
        system.send("ADD_PLANT", { region: selectedRegion,  plantType: plantType })
    }
}

export default ItemSeed;