import { default as Component} from '@core/component'

export default class TileComponent extends Component {
    constructor(payload) {
        super();
        this.componentType = "RegionTileComponent"
        this.column = payload.column;
        this.row = payload.row;
    }
}