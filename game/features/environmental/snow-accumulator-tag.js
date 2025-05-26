import { default as Tag } from '@core/tag'

export default class SnowAccumulator extends Tag {
    static tagType = 'SnowAccumulator'

    constructor() {
      super();
      this.tagType = 'SnowAccumulator'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('PositionComponent') && entity.hasComponent('SnowAccumulatorComponent');
    };

    accumulate(amount) {
        this.entity.getComponent('SnowAccumulatorComponent').amount += amount;
    }

    getAmount() {
        return this.entity.getComponent('SnowAccumulatorComponent').amount;
    }

    getXPosition() {
        return this.entity.getComponent('PositionComponent').xPosition
    }

    getYPosition() {
        return this.entity.getComponent('PositionComponent').yPosition;
    }

    getProcessedAmount() {
        return this.entity.getComponent('SnowAccumulatorComponent').processedAmount;
    }

    markProcessed() {
        this.entity.getComponent('SnowAccumulatorComponent').processedAmount = this.entity.getComponent('SnowAccumulatorComponent').amount;
    }
  }
  