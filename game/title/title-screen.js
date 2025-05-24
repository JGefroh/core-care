import Core from '@core/core';
import '@core/tag';
import { startGame } from '@game/title/start-game';


// General Mechanics
import AssetLoaderSystem from '@game/engine/assets/asset-loader-system';
import AudioListener from '@game/engine/audio/audio-listener-tag';
import AudioSystem from '@game/engine/audio/audio-system';
import Collidable from '@game/engine/collision/collidable-tag';
import CollisionSystem from '@game/engine/collision/collision-system';
import MapGeneratorSystem from '@game/engine/generators/map-generator-system';
import PropGeneratorSystem from '@game/engine/generators/prop-generator-system';
import GuiCanvasRenderable from '@game/engine/gui/gui-canvas-renderable-tag';
import GuiSystem from '@game/engine/gui/gui-system';
import LightSystem from '@game/engine/lighting/light-system';
import Lightable from '@game/engine/lighting/lightable-tag';
import Shadowable from '@game/engine/lighting/shadowable-tag';
import MovementFinalizationSystem from '@game/engine/movement/movement-finalization-system';
import MovementProposalSystem from '@game/engine/movement/movement-proposal-system';
import Movable from '@game/engine/movement/movement-tags';
import ParticleSystem from '@game/engine/particle/particle-system';
import RenderSystem from '@game/engine/renderer/render-system';
import Renderable from '@game/engine/renderer/render-tags';
import RenderablesRenderSystem from '@game/engine/renderer/renderables-render-system';
import TimerSystem from '@game/engine/timer/timer-system';
import Timer from '@game/engine/timer/timer-tag';
import Attached from '../engine/attachments/attached-tag';
import AttachmentSyncSystem from '../engine/attachments/attachment-sync-system';
import HasLogic from '../engine/logic/has-logic';
import LogicSystem from '../engine/logic/logic-system';
import Material from '../engine/material/material-tag';
import ParticleEmitter from '../engine/particle/particle-emitter-tag';
import TextureSystem from '../engine/renderer/texture-system';
import DistanceTrack from '../engine/tracker/distance-track-tag';
import DistanceTrackerSystem from '../engine/tracker/distance-tracker-system';
import FootstepFxSystem from '../features/footstep-fx/footstep-fx-system';
import HasFootsteps from '../features/footstep-fx/has-footsteps-tag';
import TrailEmitter from '../features/trail-fx/trail-emitter-tag';
import TrailSystem from '../features/trail-fx/trail-system';
import TrailZone from '../features/trail-fx/trail-zone-tag';
import AssetConfigurationSystem from '../specifics/configuration/assets/asset-configuration-system';
import CollisionConfigurationSystem from '../specifics/configuration/collision-configuration-system';
import LogicConfigurationSystem from '../specifics/configuration/logic/logic-configuration-system';




let stopTitle = false;
function addSystems() {

    ////
    // Generic systems
    ////
    // Rendering
    Core.addSystem(new RenderSystem())
        Core.addTag(Renderable)
        Core.addSystem(new RenderablesRenderSystem())
        Core.addSystem(new TextureSystem());


    // GUI
    Core.addSystem(new GuiSystem())
        Core.addTag(GuiCanvasRenderable)

    // Loaders and Gnerators
    Core.addSystem(new AssetLoaderSystem());
        Core.addSystem(new PropGeneratorSystem());
        Core.addSystem(new MapGeneratorSystem());

    // Audio
    Core.addSystem(new AudioSystem());
        Core.addTag(AudioListener);

    //Lighting
    Core.addSystem(new LightSystem())
        Core.addTag(Lightable)
        Core.addTag(Shadowable)

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
    
    // Utilities
    Core.addSystem(new TimerSystem());
        Core.addTag(Timer);


    ////
    // Features
    ////
    Core.addTag(Material);
    Core.addSystem(new FootstepFxSystem());
        Core.addTag(HasFootsteps);
    Core.addSystem(new TrailSystem());
        Core.addTag(TrailZone);
        Core.addTag(TrailEmitter);


    // Game logic and conditions

    ////
    // Game-specific configuration
    ////

    // Game Specific Configuration
    Core.addSystem(new CollisionConfigurationSystem());
    Core.addSystem(new LogicConfigurationSystem());
    Core.addSystem(new AssetConfigurationSystem({skipMapLoad: true})); // Must go after logic


    Core.start();
}

function playSounds() {
}

function addEntities() {
}

function resetSystems() {
    Core.clear();
    window.onkeydown = null;
    window.onclick = null;
}

function addHandler() {
    window.onclick = function(event) {
        window.onclick = null;
        Core.addSystem(new AudioSystem())
        playSounds(true);
    }

    window.onkeydown = function(event) {
        stopTitle = true;
        event.stopPropagation();
        event.preventDefault();
        resetSystems();
        startGame();
    };
}


////
//
////
function addTitle() {
    let titleOffsetY = -100;
    let y = window.innerHeight / 2 + titleOffsetY;
    
    Core.send('ADD_GUI_RENDERABLE', {
      key: `title-card-1`,
      xPosition: 40,
      yPosition: y,
      text: 'Care', 
      fontSize: 75,
    });
  
    Core.send('ADD_GUI_RENDERABLE', {
      key: `title-card-3`,
      xPosition: 46,
      yPosition: y + 80,
      text: 'by Joseph Gefroh',
      fontSize: 22,
    });

    Core.send('ADD_GUI_RENDERABLE', {
        key: `title-card-3`,
        xPosition: 46,
        yPosition: window.innerHeight - 40,
        text: 'github.com/jgefroh/core-care',
        fontSize: 14,
      });
  
  
    Core.send('ADD_GUI_RENDERABLE', {
      key: `title-card-2`,
      xPosition: 46,
      yPosition: y + 180,
      text: 'Press any key to start',
      fontSize: 22,
    });
  }
  


setTimeout(() => {
    if (window.location.href.includes('skiptitle')) {
        startGame()
    }
    else {
        addSystems();
        addTitle();
        addEntities();
        addHandler();
    }
}, 100)
