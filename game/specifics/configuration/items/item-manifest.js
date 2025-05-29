const ItemDefinitions = {
    SHOVEL: {
      type: "TOOL",
      name: "Shovel",
      useOn: [
          { type: "TILE", tileType: "GRASS" },
          { type: "TILE", tileType: "DIRT_TILLED" }
      ],
      effects: [
        { event: "REQUEST_TILE_CHANGE", params: { to: "DIRT" } }
      ]
    },
    HOE: {
      type: "TOOL",
      name: "Hoe",
      useOn: [{ type: "TILE", tileType: 'DIRT' }],
      effects: [
        { event: "REQUEST_TILE_CHANGE", params: { to: "DIRT_TILLED" } }
      ]
    },
  
    WATER_PAIL: {
      type: "TOOL",
      name: "Water Pail",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "REQUEST_TILE_CHANGE", params: { to: "DIRT" } }
      ]
    },
  
    DAISIES: {
      type: "PLANT",
      name: "Daisies",
      useOn: [{ type: "TILE", tileType: "GRASS" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "DAISY", scale: 0.5, stageCount: 5} }
      ],
      imagePaths: [
      ],
    },
    CARROTS: {
      type: "PLANT",
      name: "Carrots",
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

  export default ItemDefinitions;