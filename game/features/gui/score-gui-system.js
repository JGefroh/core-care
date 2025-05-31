import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';


export default class ScoreGuiSystem extends System {
    constructor(config = {}) {
      super()
      this.addScore();
    }
  
    work() {
      let score = this._core.getData('SCORE') || 0;
      this.updateScore(score);
    };

    addScore() {
      this.send('ADD_GUI_RENDERABLE', {
        key: `gui-score`,
        xPosition: 24,
        yPosition: 24,
        width: 200,
        height: 32,
        fontSize: 16,
        fontType: 'Pixellari',
        textOffsetY: 10,
        textOffsetX: 12,
        text: '$0',
        fillStyle: 'rgba(0,0,0,0.6)',
    })
    }

    updateScore(score) {
      this.send('GUI_UPDATE_PROPERTIES', {
        key: `gui-score`,
        value: {
            text: `$${score}`
        }
    })
    }
}