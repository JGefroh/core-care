import { default as Tag } from '@core/tag';

export default class RegionTile extends Tag {
    static tagType = 'RegionTile';

    constructor() {
        super();
        this.tagType = 'RegionTile';
    }

    static isAssignableTo(entity) {
        return entity.hasComponent('PositionComponent') && entity.hasComponent('RegionTileComponent');
    }

    getRow() {
        return this.entity.getComponent('RegionTileComponent').row;
    }

    getColumn() {
        return this.entity.getComponent('RegionTileComponent').column;
    }
} 