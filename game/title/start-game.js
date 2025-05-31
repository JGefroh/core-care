import '@core/component';
import Core from '@core/core';
import '@core/tag';

import '@game/title/font-loader.js';

import { createTestData } from '@game/title/test-data.js';

// General Mechanics
import GuiSystem from '@game/engine/gui/gui-system';

import TimerSystem from '@game/engine/timer/timer-system';

import AudioListener from '@game/engine/audio/audio-listener-tag';
import AudioSystem from '@game/engine/audio/audio-system';
import GuiCanvasRenderable from '@game/engine/gui/gui-canvas-renderable-tag';
import InputSystem from '@game/engine/input/input-system';
import ParticleSystem from '@game/engine/particle/particle-system';
import ViewportSystem from '@game/engine/renderer/viewport-system';

// Base gameplay systems
import MovementFinalizationSystem from '@game/engine/movement/movement-finalization-system';
import MovementProposalSystem from '@game/engine/movement/movement-proposal-system';

// Game-specific Mechanics
import InputConfigurationSystem from '@game/specifics/configuration/input-configuration-system';

    // Player Control
    import PlayerControlMovementSystem from '@game/features/player-control/player-control-movement-system';
import PlayerControllable from '@game/features/player-control/player-controllable-tag';

    // Weapons
    
import TurnsTowardsSystem from '@game/features/turn-towards-cursor/turns-towards-system';
import TurnsTowards from '@game/features/turn-towards-cursor/turns-towards-tag';



// Tags
import Movable from '@game/engine/movement/movement-tags';
import Renderable from '@game/engine/renderer/render-tags';
import Timer from '@game/engine/timer/timer-tag';

//Debug systems
import Collidable from '@game/engine/collision/collidable-tag';
import CollisionSystem from '@game/engine/collision/collision-system';
import ViewportFollowable from '@game/engine/renderer/viewport-followable-tag';
import DebugUiSystem from '@game/specifics/debug/debug-ui-system';
import Attached from '../engine/attachments/attached-tag';
import AttachmentSyncSystem from '../engine/attachments/attachment-sync-system';
import CollisionConfigurationSystem from '../specifics/configuration/collision-configuration-system';


import AiSystem from '@game/engine/ai/ai-system';
import AssetLoaderSystem from '@game/engine/assets/asset-loader-system';
import MapGeneratorSystem from '@game/engine/generators/map-generator-system';
import PropGeneratorSystem from '@game/engine/generators/prop-generator-system';
import RenderSubmissionSystem from '@game/engine/renderer/render-submission-system';
import RenderSystem from '@game/engine/renderer/render-system';
import Ai from '../engine/ai/ai-tag';
import HasLogic from '../engine/logic/has-logic';
import LogicSystem from '../engine/logic/logic-system';
import Material from '../engine/material/material-tag';
import ParticleEmitter from '../engine/particle/particle-emitter-tag';
import TextureSystem from '../engine/renderer/texture-system';
import DistanceTrack from '../engine/tracker/distance-track-tag';
import DistanceTrackerSystem from '../engine/tracker/distance-tracker-system';
import AiStateInformerSystem from '../features/ai/informers/ai-state-informer-system';
import DoorOpener from '../features/door/door-opener';
import DoorSystem from '../features/door/door-system';
import Door from '../features/door/door-tag';
import CloudGeneratorSystem from '../features/environmental/cloud-generator-system';
import DayNightCycleSystemSystem from '../features/environmental/day-night-cycle-system';
import FootstepFxSystem from '../features/footstep-fx/footstep-fx-system';
import HasFootsteps from '../features/footstep-fx/has-footsteps-tag';
import DustParticleFxSystem from '../features/fx/dust-particle-fx-system';
import TrailEmitter from '../features/trail-fx/trail-emitter-tag';
import TrailSystem from '../features/trail-fx/trail-system';
import TrailZone from '../features/trail-fx/trail-zone-tag';
import AiConfigurationSystem from '../specifics/configuration/ai-configuration-system';
import AssetConfigurationSystem from '../specifics/configuration/assets/asset-configuration-system';
import LogicConfigurationSystem from '../specifics/configuration/logic/logic-configuration-system';
import FullscreenToneSystem from '../engine/renderer/fullscreen-tone-system';
import LightSystem2 from '@game/engine/lighting/light-system-2';
import Lightable from '@game/engine/lighting/lightable-tag';
import Shadowable from '@game/engine/lighting/shadowable-tag';
import SnowSystem from '../features/environmental/snow-system';
import RegionSystem from '../engine/regions/region-system';
import RegionTile from '../engine/regions/region-tile-tag';
import SnowAccumulator from '../features/environmental/snow-accumulator-tag';
import SunSystem from '../features/environmental/sun/sun-system';
import MouseRegionSelectSystem from '../genre/2d-horizon/mouse-region-select/mouse-region-select-system';
import TileChangeSystem from '../genre/tile-management/tile-change-system';
import PlantSystem from '../genre/farm/plant-system';
import Plantable from '../genre/farm/plantable-tag';
import PlayerControlIntentSystem from '../features/player-control/player-control-intent-system';
import PlayerControlItemSelectionSystem from '../features/player-control/player-control-item-selection-system';
import ItemConfigurationSystem from '../specifics/configuration/items/item-configuration-system';
import ItemRegistrySystem from '../features/items/item-registry-system';
import AutoTileSystem from '../genre/tile-management/auto-tile-system';
import ItemBarGuiSystem from '../features/gui/item-bar-gui-system';
import TileHoverGuiSystem from '../features/gui/tile-hover-gui-system';
import ScoreSystem from '../features/scoring/score-system';
import ScoreGuiSystem from '../features/gui/score-gui-system';
export function startGame() {

    ////
    // Generic systems
    ////
    // Rendering V2
    Core.addSystem(new RenderSystem());
        Core.addSystem(new RenderSubmissionSystem());
        Core.addTag(Renderable);
        Core.addSystem(new TextureSystem());

    // EXAMPLESTART
    Core.addSystem(new FullscreenToneSystem())
    // EXAMPLEEND



    // GUI
    Core.addSystem(new GuiSystem())
        Core.addTag(GuiCanvasRenderable)

    Core.addSystem(new TileHoverGuiSystem());
    Core.addSystem(new ScoreGuiSystem());

    // Loaders and Gnerators
    Core.addSystem(new AssetLoaderSystem());
        Core.addSystem(new PropGeneratorSystem());
        Core.addSystem(new MapGeneratorSystem());

    // Camera
    Core.addSystem(new ViewportSystem());
        Core.addTag(ViewportFollowable)

    // Audio
    Core.addSystem(new AudioSystem());
        Core.addTag(AudioListener);

    //Lighting (Shadow by Default)
    // Core.addSystem(new LightSystem())
    //     Core.addTag(Lightable)
    //     Core.addTag(Shadowable)


    //Lighting (Light by Default)
    Core.addSystem(new LightSystem2())
        Core.addTag(Lightable)
        Core.addTag(Shadowable)

    // Input
    Core.addSystem(new InputSystem())

    // Per-entity logic
    Core.addSystem(new LogicSystem());
        Core.addTag(HasLogic)


    // Extras
    Core.addSystem(new ParticleSystem());
        Core.addTag(ParticleEmitter);
    

    // Movement and attached object syncing [ordering matters here]
    Core.addSystem(new MovementProposalSystem());
        Core.addTag(Movable);
        Core.addSystem(new DistanceTrackerSystem());
            Core.addTag(DistanceTrack);
        Core.addSystem(new CollisionSystem());
            Core.addTag(Collidable);
    Core.addSystem(new MovementFinalizationSystem());
    Core.addSystem(new AttachmentSyncSystem())
        Core.addTag(Attached)
    


    // Ambience
    
    // Utilities
    Core.addSystem(new TimerSystem());
        Core.addTag(Timer);

    ////
    // Features
    ////

    ////
    // RegionTile?
    ////
    Core.addSystem(new RegionSystem());
        Core.addTag(RegionTile);

    //Gameplay
    Core.addSystem(new TurnsTowardsSystem());
        Core.addTag(TurnsTowards);

    // AI and Enemies
    Core.addSystem(new AiSystem());
        Core.addTag(Ai);
    Core.addSystem(new AiStateInformerSystem())

    // Player Control (firing, moving)
    Core.addSystem(new PlayerControlMovementSystem())
        Core.addTag(PlayerControllable);
    Core.addSystem(new PlayerControlIntentSystem())
    Core.addSystem(new PlayerControlItemSelectionSystem());

    // Items and Inventory
    Core.addSystem(new ItemBarGuiSystem());
    Core.addSystem(new ItemRegistrySystem());
    Core.addSystem(new ItemConfigurationSystem());


    // Temporary region inputs
    Core.addSystem(new MouseRegionSelectSystem());

    // FArming
    Core.addSystem(new PlantSystem());
        Core.addTag(Plantable)


    // Tile system
    Core.addSystem(new TileChangeSystem());
    Core.addSystem(new AutoTileSystem());

    // FX
    Core.addTag(Material);
    Core.addSystem(new FootstepFxSystem());
        Core.addTag(HasFootsteps);
    Core.addSystem(new TrailSystem());
        Core.addTag(TrailZone);
        Core.addTag(TrailEmitter);
    Core.addSystem(new DustParticleFxSystem())


    // Prop Logic
    Core.addSystem(new DoorSystem());
        Core.addTag(Door);
        Core.addTag(DoorOpener);

    ////
    // Game-specific configuration
    ////

    Core.addSystem(new ScoreSystem())

    // Environmental
    Core.addSystem(new DayNightCycleSystemSystem());
    Core.addSystem(new CloudGeneratorSystem());
    Core.addSystem(new SunSystem());
    // Core.addSystem(new SnowSystem());
    //     Core.addTag(SnowAccumulator);

    // Game Specific Configuration
    Core.addSystem(new InputConfigurationSystem());
    Core.addSystem(new CollisionConfigurationSystem());
    Core.addSystem(new AiConfigurationSystem())
    Core.addSystem(new LogicConfigurationSystem());
    Core.addSystem(new AssetConfigurationSystem()); // Must go after logic


    //Debug
    Core.addSystem(new DebugUiSystem());


    Core.start();

    setTimeout(() => {
        createTestData();
    }, 500)
} 