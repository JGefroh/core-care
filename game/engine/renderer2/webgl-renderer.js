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
  }

  _initializeSupportedMaterials() {
    this.materialRegistry.register('basic-quad', new BasicQuadProgram(this.renderCtx, {}));
  }

  beginFrame(renderCtx, viewport, clearScreenColor) {
    this.perFrameCache = {};
    this.perFrameCache['projectionMatrix'] = this._buildProjectionMatrix(renderCtx, viewport)

    this._clearScreen(renderCtx, clearScreenColor);
  }

  draw() {
    this.flushRenderCommandBuffer(this.renderCommandBuffer)
  }

  endFrame() {
  }

  submitRenderCommand(command) {
    this.renderCommandBuffer.push(command);
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