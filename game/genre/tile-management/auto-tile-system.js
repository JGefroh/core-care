import { default as System } from '@core/system';

export default class AutoTileSystem extends System {
    constructor() {
        super();
    }

    initialize() {
        this.addHandler('TILE_CHANGED', (payload) => {
            this.changeTile(payload.entity);
        });
    }

    work() {}

    changeTile(entity) {
        if (!entity) return;

        const key = entity.key;
        const match = key.match(/region-tile-(-?\d+)-(-?\d+)/);
        if (!match) return;
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);

        const deltas = [
            { dr: -1, dc: -1 },
            { dr: -1, dc:  0 },
            { dr: -1, dc:  1 },
            { dr:  0, dc: -1 },
            { dr:  0, dc:  0 },
            { dr:  0, dc:  1 },
            { dr:  1, dc: -1 },
            { dr:  1, dc:  0 },
            { dr:  1, dc:  1 },
        ];

        for (let i = 0; i < deltas.length; i++) {
            const { dr, dc } = deltas[i];
            const neighborKey = `region-tile-${row + dr}-${col + dc}`;
            const neighborEntity = this._core.getEntityWithKey(neighborKey);

            if (neighborEntity) {
                this._changeTo(neighborEntity);
            }
        }
    }

    _changeTo(entity) {
        const key = entity.key;
        const match = key.match(/region-tile-(-?\d+)-(-?\d+)/);
        if (!match) return;
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);

        const getNeighborType = (r, c) => {
            const neighborKey = `region-tile-${r}-${c}`;
            const neighborEntity = this._core.getEntityWithKey(neighborKey);
            if (!neighborEntity) return null;

            const neighborRender = neighborEntity.getComponent('RenderComponent');
            if (!neighborRender) return null;

            return neighborRender.imagePath.split('_')[0];
        };

        const renderComponent = entity.getComponent('RenderComponent');
        if (!renderComponent) return;

        const parts = renderComponent.imagePath.split('_');
        const base = parts[0];

        const topType = getNeighborType(row - 1, col);
        const bottomType = getNeighborType(row + 1, col);
        const leftType = getNeighborType(row, col - 1);
        const rightType = getNeighborType(row, col + 1);

        const topDifferent = topType && topType !== base;
        const bottomDifferent = bottomType && bottomType !== base;
        const leftDifferent = leftType && leftType !== base;
        const rightDifferent = rightType && rightType !== base;

        const transitionMask = (topDifferent ? 1 : 0) + (bottomDifferent ? 2 : 0) + (leftDifferent ? 4 : 0) + (rightDifferent ? 8 : 0);

        if (transitionMask > 0) {
            const transitionTileMap = {
                1: '1',  // Top
                2: '7',  // Bottom
                4: '3',  // Left
                8: '5',  // Right
            
                5: '0',  // Top-Left
                9: '2',  // Top-Right
                6: '6',  // Bottom-Left
                10: '8', // Bottom-Right
            
                15: '4'  // Center
            };

            const suffix = transitionTileMap[transitionMask] || '4';
            renderComponent.imagePath = `${base}_${suffix}`;
            return;
        }

        // Same type neighbors -> Blob autotiling
        const hasTop = topType === base;
        const hasBottom = bottomType === base;
        const hasLeft = leftType === base;
        const hasRight = rightType === base;

        const blobMask = (hasTop ? 1 : 0) + (hasBottom ? 2 : 0) + (hasLeft ? 4 : 0) + (hasRight ? 8 : 0);

        const blobTileMap = {
            0: '4',   // Isolated
            1: '7',   // Top
            2: '1',   // Bottom
            3: '4',   // Top + Bottom
            4: '5',   // Left
            5: '6',   // Top + Left
            6: '0',   // Bottom + Left
            7: '4',   // Top + Bottom + Left
            8: '3',   // Right
            9: '8',   // Top + Right
            10: '2',  // Bottom + Right
            11: '4',  // Top + Bottom + Right
            12: '4',  // Left + Right
            13: '4',  // Top + Left + Right
            14: '4',  // Bottom + Left + Right
            15: '4',  // All sides
        };

        const suffix = blobTileMap[blobMask] || '4';
        renderComponent.imagePath = `${base}_${suffix}`;
    }
}