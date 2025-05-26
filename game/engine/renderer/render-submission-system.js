import { default as System } from '@core/system';

export default class RenderSubmissionSystem extends System {
  constructor() {
    super();
    this.renderer = null;
    this.renderablesLayerOrder = ['SKY', 'SKY_TOP', 'TERRAIN', 'LOWER_DECOR', 'WALL', 'PROP', 'CHARACTER_DECOR_LOWER', 'CHARACTER', 'UPPER_DECOR', 'TOP']
  }

  initialize() {
    this.send('REGISTER_RENDER_PASS', {
      name: 'WORLD',
      execute: (renderer, materialResolver) => {
        this._submitRenderableDraws(renderer, materialResolver);
      }
    });
  }

  work() {
  }

  _submitRenderableDraws(renderer, materialResolver) {
    this.workForTag('Renderable', (renderable, entity) => {
      let drawCommand = {
        shape: renderable.getShape(),
        zIndex: this.renderablesLayerOrder.indexOf(renderable.getRenderLayer() || 'TOP'),
        xPosition: renderable.getXPosition(),
        yPosition: renderable.getYPosition(),
        angleDegrees: renderable.getAngleDegrees() || 0,
        width: renderable.getWidth() ||  0,
        height: renderable.getHeight() || 0,
        texture: {
          imagePath: renderable.getImagePath(),
          imageStyle: renderable.getImageStyle()
        },
        color: renderable.getShapeColor(),
        options: {} // Use later
      }

      const materialId = materialResolver.resolve(drawCommand, {key: entity.key});
      drawCommand.materialId = materialId;
      renderer.submitRenderCommand(drawCommand);
    });
  }
}