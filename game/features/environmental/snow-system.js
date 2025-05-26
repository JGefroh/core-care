import { default as System } from '@core/system';
import { default as Core}  from '@core/core';
import { default as Entity } from '@core/entity.js'

import PositionComponent from '@game/engine/position/position-component';
import RenderComponent from '@game/engine/renderer/render-component';
import VectorComponent from '@game/engine/movement/vector-component';
import TimerComponent from '@game/engine/timer/timer-component';
import SnowAccumulatorComponent from './snow-accumulator-component';
import SnowProgram from '@game/features/environmental/snow/snow-program';

export default class SnowSystem extends System {
    constructor() {
      super()
    }

    initialize() {
        let count = 20;
        for (let i = 1; i < count; i++) {
            const x = (i / (count - 1)) * window.innerWidth;
            this.addSnowflakeEmitter(x, 0, {});
        }

        this.send('ADD_REGION_TILE_PROCESSOR', {processorFn: this.addComponents})

        this.send('REGISTER_RENDER_PASS', {
          name: 'WORLD_OVERLAY_1',
          destinationTarget: 'WORLD_OVERLAY_1',
          execute: (renderer, materialResolver) => {
              this._render(renderer, materialResolver);
          }
        });


        this.send('REGISTER_RENDER_PASS', {
          name: 'WORLD_OVERLAY_1_BLIT',
          sourceTargets: ['WORLD_OVERLAY_1'],
          execute: (renderer, materialResolver) => {
              renderer.submitRenderCommand({
                  materialId: 'blit',
              });
          }
      });

        this.send('REGISTER_MATERIAL', {
          materialId: 'snow',
          materialClass: SnowProgram
        })

        this.wait = 1000
    }

    _render(renderer, materialResolver) {
      this.workForTag('SnowAccumulator', (tag) => {
        renderer.submitRenderCommand({
          materialId: 'snow',
          xPosition: tag.getXPosition(),
          yPosition: tag.getYPosition(),
          angleDegrees: 0,
          width: 32,
          height: 32,
          options: {},
          accumulation: tag.getAmount() // Use later
        });
      });
    }
    
    work() {
      this.workForTag('SnowAccumulator', (tag) => {
        if (Math.random() <= 0.01) {
          tag.accumulate(Math.random() * 0.001)
        }
      });
    }

    addSnow(tag) {
    }

    addComponents(tag, entity) {
      if (entity.hasComponent('SnowAccumulatorComponent')) {
        return;
      }

      if (tag.getRow() < -10) {
        return;
      }

      entity.addComponent(new SnowAccumulatorComponent());
    }

    addSnowflakeEmitter(xPosition, yPosition, options) {
        this._core.send('EMIT_PARTICLES', {
            xPosition: xPosition,
            yPosition: yPosition,
            particleEmitFrequencyInMs: 500,
            particleEmissionCyclesMax:  1000000,
            particleShape: 'circle',
            particleCount: 1,
            particleLifetimeMin: 20000,
            particleLifetimeMax: 60000,
            particleHeightMin: 1, //0.08 is pretty much the smallest
            particleHeightMax: 5,
            particleWidthMin: 1,
            particleWidthMax: 5,
            particleColors: [`rgba(255, 255, 255, ${Math.min(0.2 + Math.random(), 1)})`],
            particleSpeedMin: 0.1,
            particleSpeedMax: 20,
            particleEmissionAngleDegreesMin: 70,
            particleEmissionAngleDegreesMax: 110,
            particleSpawnRadius: 100,
          });
    }
  }