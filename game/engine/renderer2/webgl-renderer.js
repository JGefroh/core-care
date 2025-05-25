import BasicQuadProgram from './programs/basic-quad-program'
import Colors from '@game/engine/util/colors';

export default class WebGLRenderer {
  constructor(renderCtx, materialRegistry) {
    this.materialRegistry = materialRegistry;
    this.renderCtx = renderCtx;
    this.perFrameCache = {};
    this.renderCommandBuffer = [];

    this._initializeSupportedMaterials();
    this.colorUtil = new Colors();
    this.textureDetails = null;
  }

  _initializeSupportedMaterials() {
    this.materialRegistry.register('basic-quad', new BasicQuadProgram(this.renderCtx, {}));
  }


  loadTexture(renderCtx, textureDetails) {
    const texture = renderCtx.createTexture();
    renderCtx.bindTexture(renderCtx.TEXTURE_2D, texture);
    textureDetails.texture = texture;

    renderCtx.texImage2D(
      renderCtx.TEXTURE_2D,
      0,
      renderCtx.RGBA,
      renderCtx.RGBA,
      renderCtx.UNSIGNED_BYTE,
      textureDetails.atlasImage
    );

    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_WRAP_S, renderCtx.CLAMP_TO_EDGE);
    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_WRAP_T, renderCtx.CLAMP_TO_EDGE);
    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_MIN_FILTER, renderCtx.NEAREST);
    renderCtx.texParameteri(renderCtx.TEXTURE_2D, renderCtx.TEXTURE_MAG_FILTER, renderCtx.NEAREST);

    this.textureDetails = textureDetails; //TODO: Make this support multiple textures when the need eventually arises.
  }

  ////
  // Rendering
  ////

  beginFrame(renderCtx, viewport, clearScreenColor) {
    this.perFrameCache = {};
    this.perFrameCache['projectionMatrix'] = this._buildProjectionMatrix(renderCtx, viewport)
    this.perFrameCache['texture0'] = this.textureDetails?.texture;

    this._clearScreen(renderCtx, clearScreenColor);
  }

  draw() {
    this.flushRenderCommandBuffer(this.renderCommandBuffer)
  }

  endFrame() {
  }

  submitRenderCommand(command) {
    if (command.imagePath) {
      command.textureUVBounds = this._getTextureUVBounds(command.imagePath);
    }
    this.renderCommandBuffer.push(command);
  }

  _getTextureUVBounds(imagePath) {
    if (!this.textureDetails) {
      return null; // No texture loaded.
    }
    let image = this.textureDetails.images[imagePath]

    if (!image) {
      return null; // Can't find image.
    }

    if (!image.uv) {
      // Calculate and cache UV
      const u0 = image.atlasXPosition / this.textureDetails.width;
      const v0 = image.atlasYPosition / this.textureDetails.height;
      const u1 = (image.atlasXPosition + image.width) / this.textureDetails.width;
      const v1 = (image.atlasYPosition + image.height) / this.textureDetails.height;
  
      image.uv = [u0, v0, u1, v1];
    }

    return image.uv
  }

  flushRenderCommandBuffer(renderCommandBuffer) {
    const grouped = new Map();

    for (const command of renderCommandBuffer) {
      const key = command.materialId;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key).push(command);
    }
  
    for (const [materialId, commands] of grouped.entries()) {
      const program = this.materialRegistry.get(materialId);
      if (!program) { continue; }
  
      program.uploadInstanceData(commands);
      program.draw(this.renderCtx, this.perFrameCache);
    }
  
    renderCommandBuffer.length = 0; // clear
  }



  _clearScreen(renderCtx, clearScreenColor) {
    const color = this.colorUtil.colorToRaw(clearScreenColor, 255);
    renderCtx.clearColor(color.r, color.g, color.b, color.a);
    renderCtx.clear(renderCtx.COLOR_BUFFER_BIT | renderCtx.DEPTH_BUFFER_BIT);
  }


  // Math and Matrixes

  _buildProjectionMatrix(renderCtx, viewport) {
    const canvasWidth = renderCtx.canvas.width;
    const canvasHeight = renderCtx.canvas.height;
    const baseScale = viewport.scale;
    const scaled = baseScale;
  
    // Compute visible world area size at this zoom
    const viewWidthWorld = canvasWidth / scaled;
    const viewHeightWorld = canvasHeight / scaled;
  
    // Center of screen in world space
    const cx = viewport.xPosition / baseScale + canvasWidth / (2 * baseScale);
    const cy = viewport.yPosition / baseScale + canvasHeight / (2 * baseScale);

    // Compute new bounds centered on screen center
    const left = cx - viewWidthWorld / 2;
    const right = cx + viewWidthWorld / 2;
    const top = cy - viewHeightWorld / 2;
    const bottom = cy + viewHeightWorld / 2;
  
    const sx = 2 / (right - left);
    const sy = 2 / (top - bottom); // keep Y up
    const tx = -(right + left) / (right - left);
    const ty = -(top + bottom) / (top - bottom);
  
    return new Float32Array([
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, -1, 0,
      tx, ty, 0, 1
    ]);
  }
} 