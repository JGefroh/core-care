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
            particleCount: 10,
            particleLifetimeMin: 150000,
            particleLifetimeMax: 150000,
            particleHeightMin: 15, //0.08 is pretty much the smallest
            particleHeightMax: 15,
            particleWidthMin: 15,
            particleWidthMax: 15,
            particleColors: [`rgba(255, 255, 255, ${Math.random()})`],
            particleSpeedMin: 0.5,
            particleSpeedMax: 10,
            particleEmissionAngleDegreesMin: 0,
            particleEmissionAngleDegreesMax: 360
        });
    }, 100)
}

function _randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}