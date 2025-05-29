const ItemDefinitions = {
    HOE: {
      type: "TOOL",
      name: "Hoe",
      useOn: [{ type: "TILE", tileType: 'DIRT' }],
      effects: [
        { event: "REQUEST_TILE_CHANGE", params: { to: "DIRT_TILLED" } }
      ]
    },
  
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
  
    WATER_PAIL: {
      type: "TOOL",
      name: "Water Pail",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "REQUEST_TILE_CHANGE", params: { to: "DIRT" } }
      ]
    },
  
    SUNFLOWER: {
      type: "PLANT",
      name: "Sunflower",
      useOn: [{ type: "TILE", tileType: "DIRT" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "SUNFLOWER" } }
      ],
    },
  
    DAISIES: {
      type: "PLANT",
      name: "Daisies",
      useOn: [{ type: "TILE", tileType: "GRASS" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "DAISY", scale: 0.5 } }
      ],
      imagePaths: [
      ],
    }
  };

  export default ItemDefinitions;