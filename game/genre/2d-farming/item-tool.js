
class ItemTool {
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
                if (context.selectedRegion.getComponent('RenderComponent').imagePath?.indexOf(`${condition.tileType}`) != -1) {
                    use = true;
                }
            }
            else if (condition.type == 'PLANT') {
                use = true;
            }
        });

        return use;
    }

    onUse(system, selectedRegion) {
        this.effects.forEach((effect) => {
            system.send(effect.event, {...effect.params, entity: selectedRegion})
        });
    }
}

export default ItemTool;