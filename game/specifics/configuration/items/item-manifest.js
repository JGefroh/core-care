const ItemDefinitions = {
    SHOVEL: {
      type: "TOOL",
      name: "Shovel",
      useOn: [
          { type: "TILE", tileType: "GRASS" },
          { type: "TILE", tileType: "DIRT_TILLED" }
      ],
      effects: [
        { event: "REQUEST_TILE_CHANGE", params: { to: "DIRT" } },
        { event: "PLAY_AUDIO", params: { audioKey: 'planting.mp3', volume: 1 }}
      ]
    },
    SYCTHE: {
      type: "TOOL",
      name: "Sycthe",
      useOn: [{ type: "PLANT" }],
      effects: [
        { event: "HARVEST_PLANT", params: { } }
      ]
    },
  
    WATER: {
      type: "TOOL",
      name: "Water",
      useOn: [{ type: "PLANT" }],
      effects: [
        { event: "ADVANCE_PLANT", params: { } }
      ]
    },
  
    DAISIES: {
      type: "PLANT",
      name: "Daisy",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "DAISY", scale: 0.5, stageCount: 5} }
      ],
      imagePaths: [
      ],
    },
    CARROTS: {
      type: "PLANT",
      name: "Carrot",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "CARROT", scale: 0.5, stageCount: 5 } }
      ],
      imagePaths: [
      ],
    },
    LETTUCE: {
      type: "PLANT",
      name: "Lettuce",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "LETTUCE", scale: 0.5, stageCount: 5 } }
      ],
      imagePaths: [
      ],
    },
    CAULIFLOWER: {
      type: "PLANT",
      name: "Cauliflower",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "CAULIFLOWER", scale: 0.5, stageCount: 5 } }
      ],
      imagePaths: [
      ],
    },
  };

  function addPlantToDefinitions(plantName) {
    const key = plantName.toUpperCase();
    const name = plantName.charAt(0).toUpperCase() + plantName.slice(1).toLowerCase();
  
    ItemDefinitions[key] = {
      type: "PLANT",
      name: name,
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: key, scale: 0.5, stageCount: 5 } }
      ],
      imagePaths: [],
    };
  }
  
  addPlantToDefinitions("lavender");


  export default ItemDefinitions;