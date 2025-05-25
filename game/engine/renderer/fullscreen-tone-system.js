import { default as System } from '@core/system';
import WebGLRenderer from '@game/engine/renderer/webgl-renderer'

export default class ToneOverlaySystem extends System {
    constructor() {
      super();
      this.toneColor = 'rgba(0,0,0,0)';
    }
  
    initialize() {
      this.addHandler('REQUEST_FULLSCREEN_TONE', (payload) => {
        this.toneColor = payload.color;
      });

      this.send('REGISTER_RENDER_PASS', {
        name: 'TONE_OVERLAY_PASS',
        execute: (renderer, materialResolver) => {
            this.render(renderer, materialResolver);
        }
      });
    }
  
    work() {
    }

    render(renderer, materialResolver) {
        let {width, height} = renderer.getCanvasDimensions();

        renderer.submitRenderCommand({
            materialId: 'fullscreen-tone',
            xPosition: 0,
            yPosition: 0,
            width: width,
            height: height,
            color: this.toneColor,
            shape: 'rectangle',
            zIndex: 999999999,
          });
          
    }
  }