"use strict";

class Game { // game class
  // in future, create instance for every new stage
  // maybe stage scripts will extend the game class?
  constructor(data) {
    console.log("[NEW GAME]");
    Object.assign(this, data);
    this.active = true;

    // camera config
    this.cameraSpeed = 0;
    this.targetCameraSpeed = 0;
    this.cameraLerpAmount = 0.5;
    this.camPos = { x: 0, y: 0 };

    // pause config
    this.setPaused = false;
    this.paused = false;
    this.timeScale = 1;

    // heads-up display, info like framerate and things
    this.hud = new GameHUD();

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
    this.projectiles = new Group();
    this.playerProjectiles = new this.projectiles.Group();

    // set main player if it doesn't exist
    window.player ||= new Player({
      game: this,
      projectiles: new this.playerProjectiles.Group(),
      layer: 1,
      input: new kbInput(),
      weapons: [
        new machineGun()
      ]
    });

    // add extra players for additional controllers connected
    contros.forEach(c => {
      const p = new Player({ game: this });
      p.input = new controllerInput({
        contro: c,
      })
    });

    // wall test - vertex mode
    this.wall = new this.walls.Sprite([[100, 100], [200, -100]], 's');
    this.wall2 = new this.walls.Sprite([[-100, -100], [-100, 100]], 's');

    // goober test
    this.thingy = new this.objects.Sprite(-canvas.hw+50,-150, 30, 30);
    this.thingy.vel.x = 1

    this.funnysound = new Howl({
      src: ['./assets/quackmp3.mp3'],
      html5: true,
      autoplay: false
    });

    // just move the camera to center, why not?
    camera.pos = { x: 0, y: 0 };

    // disable auto draw and auto update
    this.players.autoDraw = false;
    this.objects.autoDraw = false;
    this.projectiles.autoDraw = false;

    const setZoom = canvas.w / 1400;
    // const setZoom = calculateZoom(canvas.w, canvas.h, 1500);
    camera.zoom = setZoom;
    // calculate bounds
    const camBounds = calculateBounds(canvas.w, canvas.h, setZoom);

    // bounds box for debug
    this.testbounds = new Sprite(0, 0, 1400, canvas.h, "n");
    // this.testbounds.overlaps(allSprites);
    this.testbounds.fill = color(0,0,0,0);
    this.testbounds.layer = 0;
    this.testbounds.stroke = "white";
    this.testbounds.strokeWeight = 2;
    this.testbounds.stroke.setAlpha(50);

    // actual physical boundary boxes
    this.boundaries = new Group();

    // this.upperboundary = new Sprite(0, 0, 50, 50);

    // save timestamp on when the thing starts
    // main.js setup will open the menu rather than jumping straight into the game
    // new Game() will be called when entering a level
    this.startTimestamp = Date.now();
    console.log("Game initialisation complete!");
  }

  draw() { // runs at the end of the main draw function

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
      this.camPos.x += this.cameraSpeed * deltaTime * world.timeScale;
      if(this.cameraSpeed !== this.targetCameraSpeed) {
        this.cameraSpeed = deltaLerp(this.cameraSpeed, this.targetCameraSpeed, this.cameraLerpAmount);
      }
    }

    // draw sprites
    camera.on();
    this.projectiles.draw();
    this.objects.draw();
    this.players.draw();
    this.players.forEach(p => p.drawSubDetails());

    // hud is drawn last and with the camera disabled
    camera.off();
    this.hud.draw();
    camera.on();
    this.projectiles.cull(10)

    if(!this.paused) {
      // update sprites
      this.players.runUpdate();
    }

    // temporary testing stuff below
    // sound test
    if(kb.presses("y")) this.funnysound.play();

    // game speed test
    if(kb.presses("j") || contro.presses("l")) {
      if(game.timeScale === 1) {
        game.timeScale = 0.2;
      } else {
        game.timeScale = 1;
      }
    }

    // cam scroll test
    if(kb.presses("m") || contro.presses("rt")) {
      if(this.targetCameraSpeed === 0) {
        this.targetCameraSpeed = 0.1
      } else {
        this.targetCameraSpeed = 0;
      }
    }
    if(kb.presses("b") || contro.presses("lt")) {
      if(this.targetCameraSpeed === 0) {
        this.targetCameraSpeed = -0.1
      } else {
        this.targetCameraSpeed = 0;
      }
    }
  }

  exit() { // close game, remove all sprites.
    // game cannot be reused after this
    this.players.removeAll();
    this.objects.removeAll();
    this.projectiles.removeAll();
    this.draw = () => {};
    this.active = false;
  }
}