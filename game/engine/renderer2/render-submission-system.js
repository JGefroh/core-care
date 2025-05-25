import { default as System } from '@core/system';

export default class RenderSubmissionSystem extends System {
  constructor() {
    super();
    this.renderer = null;
    this.renderablesLayerOrder = ['TERRAIN', 'LOWER_DECOR', 'WALL', 'PROP', 'CHARACTER_DECOR_LOWER', 'CHARACTER', 'UPPER_DECOR', 'TOP']
  }

  initialize() {
    this.send('REGISTER_RENDER_PASS', {
      name: 'RENDERABLE_SUBMISSION',
      execute: (renderer, materialResolver) => {
        this._submitRenderableDraws(renderer, materialResolver);
      }
    });
  }

  work() {
  }

  _submitRenderableDraws(renderer, materialResolver) {
    this.workForTag('Renderable', (renderable, entity) => {
      const materialId = materialResolver.resolve(renderable);
 
      renderer.submitRenderCommand({
        materialId,
        shape: renderable.getShape(),
        zIndex: this.renderablesLayerOrder.indexOf(renderable.getRenderLayer()) || 99999,
        xPosition: renderable.getXPosition(),
        yPosition: renderable.getYPosition(),
        angleDegrees: renderable.getAngleDegrees() || 0,
        width: renderable.getWidth() ||  0,
        height: renderable.getHeight() || 0,
        imagePath: renderable.getImagePath(),
        color: renderable.getShapeColor(),
        options: {} // Use later
      });
    });

    renderer.draw();
  }
}