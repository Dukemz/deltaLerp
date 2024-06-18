"use strict";

class Game { // game class
  // in future, create instance for every new stage
  // maybe stage scripts will extend the game class?
  constructor(data) {
    console.log("[NEW GAME]");
    Object.assign(this, data);
    this.active = true;

    // heads-up display, info like framerate and things
    this.hud = new GameHUD();

    // GROUP STRUCTURE //
    // - players
    // - projectiles
    // - objects

    // all physical objects in the game that aren't players or projectiles
    this.objects = new Group();

    // all players
    this.players = new Group();
    // group of all player details e.g. shields and such
    this.playerDetails = new Group();
    this.projectiles = new Group();

    // set main player if it doesn't exist
    this.player ||= new Player({
      projectiles: new this.projectiles.Group(),
      subdetails: new this.playerDetails.Group(),
      layer: 1,
      stroke: color(0,0,0,0),
      fill: color(122, 122, 255),
      weapons: [
        new machineGun()
      ]
    });

    // in future this.player won't exist
    // at the moment the game is only single-player though
    this.players.push(this.player);

    // wall test - vertex mode
    this.wall = new this.objects.Sprite([[100, 100], [200, -100]], 's');

    // various objects
    this.randomObjs = new this.objects.Group();
    this.randomObjs.height = 50;
    this.randomObjs.width = 50;
    this.randomObjs.drag = 1;
    this.randomObjs.rotationDrag = 1;
    // assume center is 0, 0
    // this needs to be updated to account for camera position
    this.randomObjs.x = () => random(-canvas.hw, canvas.hw);
    this.randomObjs.y = () => random(-canvas.hh, canvas.hh);
    // visual properties
    this.randomObjs.stroke = 255;
    this.randomObjs.strokeWeight = 2;
    // set layer
    this.randomObjs.layer = () => {
      const layer = this.objects._getTopLayer() + 1 || 5;
      return layer;
    }

    this.rocks = new this.randomObjs.Group();
    this.rocks.image = () => random(["🗿", "💀"]);
    this.rocks.collides(this.player.projectiles, (_p, b) => b.remove());
    this.rocks.amount = 5;

    this.stars = new this.randomObjs.Group();
    this.stars.image = "✨";
    this.stars.overlaps(this.player.projectiles, (_p, b) => b.remove());
    this.stars.amount = 2;

    // just move the camera to center, why not?
    camera.pos = { x: 0, y: 0 };

    // disable auto draw
    this.objects.autoDraw = false;
    this.projectiles.autoDraw = false;

    // save timestamp on when the thing starts
    // at some point game will be a class, so setup opens the menu rather than jumping straight into the game
    this.startTimestamp = Date.now();
    console.log("Game initialisation complete!");
  }

  draw() { // runs at the end of the main draw function
    camera.on();
    this.projectiles.draw();
    this.objects.draw();
    this.playerDetails.draw();
    this.players.draw();
    // hud is drawn last and with the camera disabled
    camera.off();
    this.hud.draw();

    this.randomObjs.cull(50, 50, 50, 50);
    this.randomObjs.amount = 10;

    // the attractive
    // this.stars.attractTo(this.player, 1);
    this.stars.overlaps(this.player);
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