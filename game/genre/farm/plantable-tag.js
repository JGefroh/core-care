import { default as Tag } from '@core/tag'

export default class Plantable extends Tag{
  static tagType = 'Plantable'

    constructor() {
        super()
        this.tagType = 'Plantable'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PlantComponent');
    };
  }
  