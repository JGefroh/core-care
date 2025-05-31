const ItemDefinitions = {
    SHOVEL: {
      type: "TOOL",
      name: "Shovel",
      description: 'Shovel - turn grass into dirt; you can only plant your seeds in dirt!',
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
      name: "Scythe",
      description: 'Scyhte - Harvest your plants.',
      useOn: [{ type: "PLANT" }],
      effects: [
        { event: "HARVEST_PLANT", params: { } },
        { event: "PLAY_AUDIO", params: { audioKey: 'scythe.mp3', volume: 1 }}
      ]
    },
  
    WATER: {
      type: "TOOL",
      name: "Water",
      description: 'Water can - Water your plants to ensure they grow.',
      useOn: [{ type: "PLANT" }],
      effects: [
        { event: "ADVANCE_PLANT", params: { } },
        { event: "PLAY_AUDIO", params: { audioKey: 'water.mp3', volume: 1 }}
      ]
    },
  
    DAISIES: {
      type: "PLANT",
      name: "Daisy",
      description: 'Daisy - pretty flowers.',
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
      description: 'Carrots - great for eyesight and bunnies.',
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
      description: 'Lettuce - flavorless but full of fiber!',
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
      description: 'Cauliflower - mother earth\'s apology for broccoli',
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "CAULIFLOWER", scale: 0.5, stageCount: 5 } }
      ],
      imagePaths: [
      ],
    },
  };

  function addPlantToDefinitions(plantName, description) {
    const key = plantName.toUpperCase();
    const name = plantName.charAt(0).toUpperCase() + plantName.slice(1).toLowerCase();
  
    ItemDefinitions[key] = {
      type: "PLANT",
      name: name,
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      description: description,
      effects: [
        { event: "ADD_PLANT", params: { type: key, scale: 0.5, stageCount: 5 } }
      ],
      imagePaths: [],
    };
  }
  
  addPlantToDefinitions("lavender", 'Lavender - fragrant and purple');


  export default ItemDefinitions;