import { default as System } from '@core/system';
import { default as Entity } from '@core/entity.js'
import RegionTile from './region-tile-tag';
import RegionTileComponent from './region-tile-component';
import PositionComponent from '../position/position-component';
import RenderComponent from '../renderer/render-component';

export default class RegionSystem extends System {
    constructor() {
        super()
        this.regionMap = new Map();
        this.regionTileSize = 32;
        this.mapRegionAround(0, 0, 500)
        this.regionTileProcessors = [];
        this.wait = 1000

        this.newProcessorAdded = false;
    }

    initialize() {
        this.addHandler('ADD_REGION_TILE_PROCESSOR', (payload) => {
            this.newProcessorAdded = true;
            this.regionTileProcessors.push(payload.processorFn);
        });
    }

    work() {
        this.regionTileProcessors.forEach((regionTileProcessor) => {
            this.forEachTile(regionTileProcessor);
        });
    }
    
    forEachTile(fn) {
        this.workForTag('RegionTile', (tag, entity) => {
            fn(entity);
        })
    }

    mapRegionAround(xPosition, yPosition, range) {
        const startXPosition = xPosition - range;
        const endXPosition = xPosition + range;
        const startYPosition = yPosition - range;
        const endYPosition = yPosition + range;
    
        for (let currentXPosition = startXPosition; currentXPosition <= endXPosition; currentXPosition += this.regionTileSize) {
            for (let currentYPosition = startYPosition; currentYPosition <= endYPosition; currentYPosition += this.regionTileSize) {
                const column = Math.floor(currentXPosition / this.regionTileSize);
                const row = Math.floor(currentYPosition / this.regionTileSize);

                const regionKey = `region-tile-${row}-${column}`;
                if (!this.regionMap.has(regionKey)) {
                    this.createRegionEntity(row, column);
                    this.regionMap.set(regionKey, true);
                }
            }
        }
    }

    createRegionEntity(row, column) {
        let entity = new Entity({key: `region-tile-${row}-${column}`});
        entity.addComponent(new PositionComponent({
            xPosition: column * this.regionTileSize,
            yPosition: row * this.regionTileSize,
            width: this.regionTileSize,
            height: this.regionTileSize
        }));
        entity.addComponent(new RegionTileComponent({
            row: row,
            column: column
        }));

        entity.addComponent(new RenderComponent({
            width: this.regionTileSize,
            height: this.regionTileSize,
            shapeColor: 'rgba(255,0,0,1)'
        }));

        this._core.addEntity(entity);
    }
}