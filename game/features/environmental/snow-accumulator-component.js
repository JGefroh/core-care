import { default as Component } from '@core/component';

export default class SnowAccumulatorComponent extends Component {
    constructor(payload = {}) {
        super()
        this.componentType = 'SnowAccumulatorComponent'
        this.amount = payload.amount || 0;
        this.processedAmount = 0;
    }
}