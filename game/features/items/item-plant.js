class ItemPlant {
    constructor(itemDefinition) {
        this.key = itemDefinition.key;
        this.name = itemDefinition.name;
        this.useOn = itemDefinition.useOn;
        this.effects = itemDefinition.effects;
    }


    canUse(context) {
        let use = false;
        this.useOn.forEach((condition) => {
            if (use) {
                return;
            }

            if (condition.type == 'TILE') {

                if (context.selectedRegion.getComponent('RenderComponent').imagePath?.indexOf(`${condition.tileType}_`) != -1) {
                    use = true;
                }
            }
        });

        return use;
    }

    onUse(system, selectedRegion) {
        system.send(this.effects[0].event, {...this.effects[0].params, entity: selectedRegion})
    }
}

export default ItemPlant;