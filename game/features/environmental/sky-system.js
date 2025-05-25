import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import Colors from '@game/engine/util/colors';
import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';


export default class SkySystem extends System {
    constructor() {
      super()
      this.colors = new Colors();
      this.skyColors = [
        "rgba(11,12,16,1)",
        "rgba(28,31,42,1)",
        "rgba(43,58,103,1)",
        "rgba(166,126,97,1)",    // desaturated warm brownish-pink (high sky)
        "rgba(252,161,125,1)",
        "rgba(177,208,224,1)",
        "rgba(135,206,235,1)",
        "rgba(92,160,211,1)",
        "rgba(135,207,234,1)",  // daytime sky blue
        "rgba(252,204,102,1)",  // golden yellow (transition color)
        "rgba(250,140,102,1)",  // sunrise/sunset (reddish orange)
        "rgba(255,94,58,1)",    // deep orange-red at horizon
        "rgba(252,142,83,1)",   // orange
        "rgba(166,126,97,1)",    // desaturated warm brownish-pink (high sky)
        "rgba(13,51,102,1)",     // deep zenith blue
        "rgba(46,43,95,1)",
        "rgba(0,0,0,1)",
      ]
      this.currentStep = 0;
      this.currentColorIndex = Math.floor(Math.random() * this.skyColors.length);
      this.stepColor = null;
      this.nextColorIndex = 1;
      this.numberSteps = 10;
      this.wait = 10;

    }

    initialize() {
    }
    
    work() {
      if (this.currentStep >= this.numberSteps) {
        this.currentStep = 1;
        this.nextColor();
      }
      let renderable = this.getTag('Renderable');
      this.forKeyedAs('SKY', (skyEntity) => {
        renderable.setEntity(skyEntity);
  
        let currentColor = this.skyColors[this.currentColorIndex];
        let targetColor = this.skyColors[this.nextColorIndex]
  
        let newColor = this.colors.interpolateRgba(currentColor, targetColor, this.numberSteps, this.currentStep)
        this.stepColor = newColor;
        renderable.setShapeColor(newColor);
        this.currentStep++;


        this.send("REQUEST_FULLSCREEN_TONE", {color: currentColor.replace(',1)', ', 0.9)')});
      });
      
    }

    nextColor() {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.skyColors.length;
      this.nextColorIndex = (this.currentColorIndex + 1) % this.skyColors.length;
    }
  }