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
        this.mapRegionAround(0, 0, 550, 300)
        this.regionTileProcessors = [];
        this.wait = 1000
    }

    initialize() {
        this.addHandler('ADD_REGION_TILE_PROCESSOR', (payload) => {
            this.regionTileProcessors.push(payload.processorFn);
        });

        this.addHandler('GET_CLOSEST_REGION', (payload) => {
            let results = this.getRowColumnForCoordinates(payload.xPosition, payload.yPosition);
            if (results) {
              let regionEntity = this._core.getEntityWithKey(`region-tile-${results.row}-${results.column}`);
              payload.callback(regionEntity);
            }
        });
    }

    work() {
        this.regionTileProcessors.forEach((regionTileProcessor) => {
            this.forEachTile(regionTileProcessor);
        });
    }
    
    forEachTile(fn) {
        this.workForTag('RegionTile', (tag, entity) => {
            fn(tag, entity);
        })
    }

    mapRegionAround(xPosition, yPosition, rangeX, rangeY) {
        const startXPosition = Math.floor((xPosition - rangeX) / this.regionTileSize) * this.regionTileSize;
        const endXPosition = Math.floor((xPosition + rangeX) / this.regionTileSize) * this.regionTileSize;
        const startYPosition = Math.floor((yPosition - rangeY) / this.regionTileSize) * this.regionTileSize;
        const endYPosition = Math.floor((yPosition + rangeY) / this.regionTileSize) * this.regionTileSize;
        
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
            imagePath: 'GRASS_5',
        }));

        this._core.addEntity(entity);
    }

    getRowColumnForCoordinates(xPosition, yPosition) {
        const column = Math.round(xPosition / this.regionTileSize);
        const row = Math.round(yPosition / this.regionTileSize);
        return { row, column };
    }
    
}