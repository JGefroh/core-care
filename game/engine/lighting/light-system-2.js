import { default as System } from '@core/system';

export default class LightSystem2 extends System {
    constructor() {
        super();
        this.forceRecalculateLight = false;
    }

    initialize() {
        this.addHandler('FORCE_RECALCULATE_LIGHT', (payload) => {
            this.forceRecalculateLight = true;
        });

        this.send('REGISTER_RENDER_PASS', {
            name: 'LIGHTING',
            destinationTarget: 'LIGHTING',
            execute: (renderer, materialResolver) => {
                this._render(renderer, materialResolver);
            }
        });
    }

    work() {
    }

    _render(renderer, materialResolver) {
        this.workForTag('Lightable', (lightable, entity) => {
            if (!lightable.isOn() && !this.forceRecalculateLight) {
                return;
            }
            if (lightable.shouldFlickerOff(true) && !this.forceRecalculateLight) {
            }
            if (lightable.shouldFlickerOff() && !this.forceRecalculateLight) {
                return;
            }
            this._renderLight(renderer, lightable);
        })

        this.forceRecalculateLight = false;
    }

    _renderLight(renderer, lightable) {
        renderer.submitRenderCommand({
            materialId: 'basic-light',
            shape: 'circle',
            xPosition: lightable.getXPosition(),
            yPosition: lightable.getYPosition(),
            angleDegrees: 0,
            width: lightable.getMaxDistance(),
            height: lightable.getMaxDistance(),
            color: lightable.getColors()[0],
            options: {} 
          });
    }
} 

