import { default as Component} from '@core/component'

export default class PlantComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = "PlantComponent"

        this.type = payload.type;
        this.stageCount = payload.stageCount;
        this.stageCurrent = payload.stageCurrent || 0;
    }
}