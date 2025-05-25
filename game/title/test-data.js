import '@core/component';
import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js';
import '@core/tag';

import '@game/title/font-loader.js';


export function createTestData() {
    setInterval(() => {
        Core.send('EMIT_PARTICLES', {
            xPosition: 300,
            yPosition: 300,
            particleEmitFrequencyInMs: 0,
            particleEmissionCyclesMax: 1,
            particleShape: 'circle',
            particleCount: 100,
            particleLifetimeMin: 150000,
            particleLifetimeMax: 150000,
            particleHeightMin: 0.5, //0.08 is pretty much the smallest
            particleHeightMax: 12,
            particleWidthMin: 0.5,
            particleWidthMax: 12,
            particleColors: [`rgba(255, 255, 255, ${Math.random()})`],
            particleSpeedMin: 0.5,
            particleSpeedMax: 10,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360
        });
    }, 1000)
}

function _randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}