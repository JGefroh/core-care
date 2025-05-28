const ItemDefinitions = {
    HOE: {
      type: "TOOL",
      name: "Hoe",
      useOn: [{ type: "PLANT" }],
      effects: [
        { event: "HARVEST_PLANT" }
      ]
    },
  
    SHOVEL: {
      type: "TOOL",
      name: "Shovel",
      useOn: [{ type: "TILE", tileType: "GRASS" }],
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
      imagePaths: [
        "SUNFLOWER.png"
      ]
    },
  
    DAISIES: {
      type: "PLANT",
      name: "Daisies",
      useOn: [{ type: "TILE", tileType: "GRASS" }],
      effects: [
        { event: "ADD_PLANT", params: { type: "DAISY" } }
      ],
      imagePaths: [
        "DAISY.png"
      ]
    }
  };

  export default ItemDefinitions;