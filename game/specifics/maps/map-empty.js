const map = {
    floors: [
        {key: 'SKY', xPosition: 0, yPosition: -500, width: 1000, height: 320, color: '#4FC3F7', renderLayer: 'SKY' }, // Sky
        {xPosition: 0, yPosition: -400, width: 1000, height: 100, color: '#FF00FF', imageKey: 'BG_MOUNTAIN' }, // Mountain
        {xPosition: 0, yPosition: -270, width: 1100, height: 260, color: '#FF00FF', imageKey: 'BG_TREELINE' }, // Mountain
    ],
    walls: [
        {from: [-600,-340], to: [500,-340], collision: 'WALL', color: 'rgba(0,0,0,0)'},
        {offset: [0, 500], color: 'rgba(0,0,0,0)'},
        {offset: [-910, 0], color: 'rgba(0,0,0,0)'},
        {offset: [0, -500], color: 'rgba(0,0,0,0)'},
    ],
    props: [
    ],
    lights: [
    ],
    enemies: [
    ]
}
export default map;