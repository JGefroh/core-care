import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

export default class ScoreSystem extends System {
    constructor() {
      super()
      this.score = 0;

      this.addHandler('ADD_SCORE', (payload) => {
        this.score += payload;
        this._core.publishData('SCORE', this.score);
      })
    }

    work() {}
  }