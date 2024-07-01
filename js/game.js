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

    // all players
    this.players = new Group();
    // group of all player details e.g. shields and such
    this.playerDetails = new Group();
    this.projectiles = new Group();

    // set main player if it doesn't exist
    this.player ||= new Player({
      game: this,
      projectiles: new this.projectiles.Group(),
      subdetails: new this.playerDetails.Group(),
      layer: 1,
      fill: color(122, 122, 255),
      input: new kbInput(),
      weapons: [
        new machineGun()
      ]
    });

    // in future this.player won't exist
    // at the moment the game is only single-player though
    this.players.push(this.player);

    // wall test - vertex mode
    this.walls = new this.objects.Group();
    this.walls.collides(this.projectiles, (_w, p) => p.remove());

    this.wall = new this.walls.Sprite([[100, 100], [200, -100]], 's');
    this.wall2 = new this.walls.Sprite([[-100, -100], [-100, 100]], 's');

    // goober test
    this.thingy = new this.objects.Sprite(-canvas.hw+50,-150, 30, 30);
    this.thingy.vel.x = 1

    this.funnysound = new Howl({
      src: ['./assets/quackmp3.mp3'],
      html5: true,
      autoplay: false
    })

    // just move the camera to center, why not?
    camera.pos = { x: 0, y: 0 };

    // disable auto draw and auto update
    this.players.autoDraw = false;
    this.objects.autoDraw = false;
    this.projectiles.autoDraw = false;

    // save timestamp on when the thing starts
    // at some point game will be a class, so setup opens the menu rather than jumping straight into the game
    this.startTimestamp = Date.now();
    console.log("Game initialisation complete!");
  }

  draw() { // runs at the end of the main draw function
    
    // pause logic
    if(kb.presses("p")) this.setPaused = !this.setPaused;

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
      camera.x += this.cameraSpeed * deltaTime;
      if(this.cameraSpeed !== this.targetCameraSpeed) {
        this.cameraSpeed = deltaLerp(this.cameraSpeed, this.targetCameraSpeed, this.cameraLerpAmount);
      }
    }

    // draw sprites
    camera.on();
    this.projectiles.draw();
    this.objects.draw();
    this.playerDetails.draw();
    this.players.draw();
    // hud is drawn last and with the camera disabled
    camera.off();
    this.hud.draw();

    // update sprites
    this.playerDetails.runUpdate();
    this.players.runUpdate();
  }

  exit() { // close game, remove all sprites.
    // game cannot be reused after this
    this.players.remove();
    this.playerDetails.remove();
    this.objects.remove();
    this.projectiles.remove();
    this.hud.remove();
    this.draw = () => {};
    this.active = false;
  }
}