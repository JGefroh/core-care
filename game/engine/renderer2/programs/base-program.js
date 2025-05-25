
import { default as quadFragmentShaderSourceCode } from '@game/engine/renderer2/shaders/quad-fragment-shader';
import { default as quadVertexShaderSourceCode } from '@game/engine/renderer2/shaders/quad-vertex-shader';

import { compileShader } from '@game/engine/renderer2/util/shader-util';

import Colors from '@game/engine/util/colors';

class BaseProgram {
    constructor(renderCtx, config) {
        this.maxBufferSize = 50000 * 2 * 4;
        this.buffers = {};
        this.vertexArrayObjects = {};
        this.program = null;
        this.flushCountMax = config.flushCountMax || 60;
        this.colorUtil = new Colors();
        this.flushIndex = 0

        this._ensureInstanceBuffers();
        this._initializeProgram(renderCtx);
        this._initializeBuffers(renderCtx);
    }

    getProgram() {
        return this.program;
    }

    getVertexArrayObjects() {
        return this.vertexArrayObjects;
    }

    getBuffers() {
        return this.buffers;
    }

    uploadInstanceData(commands) {
    }



    /////
    // Draw
    ////

    draw(renderCtx, perFrameCache) {
      this._flushInstanceDataBuffer(renderCtx, perFrameCache);
    }

    _flushInstanceDataBuffer(renderCtx, perFrameCache) {
    }

    _bindToBufferIfExists(renderCtx, buffers, key, array) {
      const buffer = buffers[key];

      if (!array?.length) {
        return;
      }
      renderCtx.bindBuffer(renderCtx.ARRAY_BUFFER, buffer);
      renderCtx.bufferSubData(renderCtx.ARRAY_BUFFER, 0, new Float32Array(array));
    }

    _clearInstanceBuffers() {
      // Keep variables but change size - or else the buffers will not be bound correctly
      Object.values(this.instanceBuffers).forEach((array) => {
        array.length = 0;
      });
    }

    _getFlushIndex() {
      this.flushIndex = (this.flushIndex + 1) % this.flushCountMax;
      return this.flushIndex;
    }


    /////
    // Initialization
    ////

    _initializeProgramGeneric(renderCtx, vertexShaderSourceCode, fragmentShaderSourceCode, uniforms) {
      const program = renderCtx.createProgram();

      let vertexShader = compileShader(renderCtx, vertexShaderSourceCode, renderCtx.VERTEX_SHADER)
      renderCtx.attachShader(program, vertexShader);

      let fragmentShader = compileShader(renderCtx, fragmentShaderSourceCode, renderCtx.FRAGMENT_SHADER)
      renderCtx.attachShader(program, fragmentShader);

      renderCtx.linkProgram(program);


      let uniformLocations = {}
      uniforms.forEach((uniform) => { uniformLocations[uniform] = renderCtx.getUniformLocation(program, uniform); })

      this.program = {
          program: program,
          attributes: {},
          uniforms: uniformLocations
      }

      return this.program;
    }

    initializeBuffersFor(renderCtx, key, size = this.maxBufferSize, drawType = renderCtx.DYNAMIC_DRAW, index, vertexBindFn = () => {}) {
        let buffer = renderCtx.createBuffer()
        this.buffers[`${key}_${index}`] = buffer;
        renderCtx.bindBuffer(renderCtx.ARRAY_BUFFER, buffer);
        renderCtx.bufferData(renderCtx.ARRAY_BUFFER, size, drawType); // dummy size
  
        vertexBindFn()
    }
}

export default BaseProgram;