import { default as Tag } from '@core/tag'

export default class Timer extends Tag{
    static tagType = 'Timer'

    constructor() {
        super()
        this.tagType = 'Timer'
    }

    static isAssignableTo(entity) {
      return entity.hasComponent('TimerComponent')
    };

    isTime() {
      return !this.entity.getComponent('TimerComponent').endedAt && (Date.now() - this.entity.getComponent('TimerComponent').startedAt >= this.entity.getComponent('TimerComponent').time)
    }

    getOnEndEffect() {
      return this.entity.getComponent('TimerComponent').onEndEffect
    }

    setStartedAt(startedAt) {
      this.entity.getComponent('TimerComponent').startedAt = startedAt;
    }

    setEndedAt(endedAt) {
      this.entity.getComponent('TimerComponent').endedAt = endedAt;
    }

    shouldRepeat() {
      return this.entity.getComponent('TimerComponent').shouldRepeat;
    }

    removeTimer() {
      this.entity.removeComponent('TimerComponent');
    }
  }
  