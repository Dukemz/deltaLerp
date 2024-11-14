"use strict";

class Game { // game class
  // in future, create instance for every new stage
  // maybe stage scripts will extend the game class?
  constructor(data) {
    console.log("[GAME] Creating new game...");
    Object.assign(this, data);
    this.active = true;
    manager.ingame = true;

    // background colour
    this.bgcol = color("#242838");
    this.bgOpacityLerp = new LerpController(128, 128, 0.999);

    // camera config
    this.cameraSpeedLerp = new LerpController(0, 0, 0.5);
    this.camPos = { x: 0, y: 0 };
    // width of the visible area
    this.visibleWidth = 1400;
    this.cullZoneLeft = (this.visibleWidth/2)-10;
    this.cullZoneRight = (this.visibleWidth/2)+10;
    // last time the window was resized
    this.lastWindowResize = world.realTime;

    // pause config
    this.setPaused = false;
    this.paused = false;
    this.timeScale = 1;

    // heads-up display, info like framerate and things
    this.hud = new GameHUD({ game: this });

    // GROUP STRUCTURE //
    // - players
    // - projectiles
    // - objects

    // all physical objects in the game that aren't players or projectiles
    this.objects = new Group();
    this.objects.stroke = "white";
    this.objects.strokeWeight = 2
    // terrain
    this.walls = new this.objects.Group();

    // all players
    this.players = new Group();
    // all projectiles
    this.projectiles = new Group();
    this.playerProjectiles = new this.projectiles.Group();
    this.enemyProjectiles = new this.projectiles.Group();
    // enemies
    this.enemies = [];
    this.enemyObjects = new Group();

    // set main player - this is temporary for now
    window.player = new Player({
      game: this,
      projectiles: new this.playerProjectiles.Group(),
      layer: 1,
      input: new kbInput(),
      // weapons: [
      //   new MachineGun(),
      //   new Shotgun()
      // ]
    });

    // add extra players for additional controllers connected
    contros.forEach(c => {
      const p = new Player({ game: this });
      p.input = new controllerInput({
        contro: c,
      })
    });

    // this.levelwalls = new this.walls.Group();
    // wall test - vertex mode
    // this.wall = new this.levelwalls.Sprite([[100, 100], [200, -100]], 's');
    // this.wall2 = new this.levelwalls.Sprite([[-100, -100], [-100, 100]], 's');

    // just move the camera to center, why not?
    camera.pos = { x: 0, y: 0 };

    // disable auto draw and auto update
    this.players.autoDraw = false;
    this.objects.autoDraw = false;
    this.projectiles.autoDraw = false;
    this.enemyObjects.autoDraw = false;

    // top and bottom boundary walls
    this.boundaries = new this.walls.Group();
    this.boundaries.autoDraw = false;
    this.boundaries.collider = "s";
    this.boundaries.fill = () => this.bgcol;
    this.boundaries.stroke = color(255, 255, 255, 50);
    this.boundaries.strokeWeight = 2;
    // calculate offset based on position and height
    this.boundaries.offset = i => { // i is index in group
      const thisBoundary = this.boundaries[i];
      const halfHeight = thisBoundary.height/2;
      const isNegative = thisBoundary.y < 0;

      const x = 0;
      // flip offset if y is negative      
      const y = isNegative ? -halfHeight : halfHeight;
      thisBoundary.y
      return { x, y };
    }

    // create boundaries
    this.lowerboundary = new this.boundaries.Sprite(0, 305, this.visibleWidth, 2000);
    this.upperboundary = new this.boundaries.Sprite(0, -305, this.visibleWidth, 2000);

    // draw opaque bg
    background(this.bgcol);

    // TESTING STUFFS //
    this.hexsplit = new BasicSplitter({ game: this, x: 500, y: 200 });
    this.pentasplit = new BasicSplitter({ game: this, x: 500, y: -200, splitterShape: "pentagon", splitterColour: 'blue' });
    this.octasplit = new BasicSplitter({ game: this, x: 500, splitterShape: "octagon", splitterSpikeSize: 70, splitterColour: 'purple' });

    const setZoom = canvas.w / this.visibleWidth;
    // const setZoom = calculateZoom(canvas.w, canvas.h, 1500);
    camera.zoom = setZoom;
    // calculate bounds
    // const camBounds = this.calculateBounds(canvas.w, canvas.h, setZoom);

    // funny death sfx
    if(!manager.assets.audio["dl.deathsfx"]) loadScripts(["assets/deathsfx.dzdla"]);

    // save timestamp on when the thing starts
    // main.js setup will open the menu rather than jumping straight into the game
    // new Game() will be called when entering a level
    this.startTimestamp = Date.now();
    console.log("[GAME] Game creation complete!");
  }

  draw() { // runs at the end of the main draw function
    // set actual camera position to game's set position
    camera.pos = game.camPos;

    // copy bg colour
    const backgroundCol = color(this.bgcol.levels);
    const bgopacity = this.bgOpacityLerp.currentValue;

    if(window.Q5) { // q5.js workaround
      backgroundCol.a = bgopacity;
    } else {
      backgroundCol.setAlpha(bgopacity);
    }
    background(backgroundCol);

    // pause logic
    this.players.forEach(p => {
      if(p.input.pause()) this.setPaused = !this.setPaused;
    }) 

    if(this.setPaused) {
      this.paused = true;
    } else if(document.visibilityState !== "visible") {
      this.paused = true;
    } else {
      this.paused = false;
    }

    if(this.paused) {
      world.timeScale = 0;
    } else {
      world.timeScale = this.timeScale;

      // calculation for camera movement
      // this is about as accurate as i can make it lol
      this.camPos.x += this.cameraSpeedLerp.currentValue * deltaTime * world.timeScale;

      this.cameraSpeedLerp.update();
      this.bgOpacityLerp.update();
    }

    if(!this.players.length) this.cameraSpeedLerp.targetValue = 0;

    // draw sprites
    camera.on();
    this.boundaries.draw();
    this.enemyObjects.draw();
    this.projectiles.draw();
    this.objects.draw();
    this.players.draw();
    // this.players.forEach(p => p.drawSubDetails());
    for(let p of this.players) p.drawSubDetails();

    // hud is drawn last and with the camera disabled
    camera.off();
    this.hud.draw();
    camera.on();
    // cull seems to be broken at the moment whenever the zoom is not 1?
    // this.projectiles.cull(10);

    // update stuff //

    if(!this.paused) {
      // update sprites
      // this.enemies.forEach(en => en.update());
      for(let en of this.enemies) en.update();
      this.players.runUpdate();
    }

    // TEMPORARY DEBUG THINGS //

    // game speed test
    if(kb.presses("j") || contro.presses("l")) {
      if(game.timeScale === 1) {
        game.timeScale = 0.3;
        this.bgOpacityLerp.targetValue = 30;
      } else {
        game.timeScale = 1;
        this.bgOpacityLerp.targetValue = 128;
      }
    }

    // cam scroll test
    if(kb.presses("m") || contro.presses("rt")) {
      if(this.cameraSpeedLerp.targetValue === 0) {
        this.cameraSpeedLerp.targetValue = 0.1
      } else {
        this.cameraSpeedLerp.targetValue = 0;
      }
    }
    if(kb.presses("b") || contro.presses("lt")) {
      if(this.cameraSpeedLerp.targetValue === 0) {
        this.cameraSpeedLerp.targetValue = -0.1
      } else {
        this.cameraSpeedLerp.targetValue = 0;
      }
    }
    // crash lol
    if(kb.presses("q")) throw Error("Congrats, you found the crash button!");
  }

  kb2P() { // temporary function to add 2nd player with keyboard preset
    player.input.presetWASD();
    const newp = new Player();
    newp.input.presetArrows();
  }

  windowResized(oldWidth, oldHeight, oldZoom) {
    // change zoom
    const setZoom = canvas.w / this.visibleWidth;
    // const setZoom = calculateZoom(canvas.w, canvas.h, 1500);
    camera.zoom = setZoom;
    console.log(`[GAME] Changed zoom: [${oldZoom.toFixed(3)}] => [${setZoom.toFixed(3)}]`);
    
    // set the bg colour again to avoid that weird messy effect
    background(this.bgcol);
  }

  // function to calculate visible area
  // DEPRECATED: likely won't use
  calculateBounds() {
    const visibleWidth = canvas.w / camera.zoom;
    const visibleHeight = canvas.h / camera.zoom;

    // assuming the camera is centered, calculate the bounds
    const halfVisibleWidth = visibleWidth / 2;
    const halfVisibleHeight = visibleHeight / 2;

    // define the bounds as top-left and bottom-right coordinates
    const bounds = {
      topLeft: {
        x: -halfVisibleWidth,
        y: -halfVisibleHeight
      },
      bottomRight: {
        x: halfVisibleWidth,
        y: halfVisibleHeight
      }
    };

    return bounds;
  }

  exit() { // close game, remove all sprites.
    // game cannot be reused after this

    // todo: make sure ALL groups are removed. write func in player/enemy classes to remove all their groups?
    this.players.remove();
    this.objects.remove();
    this.projectiles.remove();
    this.enemyObjects.remove();
    // this.draw = () => {};
    this.active = false;
    manager.ingame = false;
  }
}