"use strict";

class Game { // game class
  // in future, create instance for every new stage
  // maybe stage scripts will extend the game class?
  constructor(data) {
    console.log("[NEW GAME]");
    Object.assign(this, data);

    // set player if it doesn't exist
    // in future - array of players, menu config to constructor?
    this.player ||= new Player({
      layer: 1,
      stroke: color(122, 122, 255),
      weapons: [
        new machineGun()
      ]
    });

    this.objects = new Group();

    // various objects
    this.randomObjs = new this.objects.Group();
    this.randomObjs.height = 50;
    this.randomObjs.width = 50;
    this.randomObjs.drag = 1;
    this.randomObjs.rotationDrag = 1;
    // assume center is 0, 0
    this.randomObjs.x = () => random(-canvas.hw, canvas.hw);
    this.randomObjs.y = () => random(-canvas.hh, canvas.hh);

    this.rocks = new this.randomObjs.Group();
    this.rocks.image = () => random(["🗿", "💀"]);
    this.rocks.collides(this.player.projectiles, (_p, b) => b.remove())
    this.rocks.amount = 5;

    this.stars = new this.randomObjs.Group();
    this.stars.image = "✨";
    this.stars.overlaps(this.player.projectiles, (_p, b) => b.remove());
    this.stars.amount = 5;

    // just move the camera to center, why not?
    camera.pos = { x: 0, y: 0 };
    background("#242838");

    // save timestamp on when the thing starts
    // at some point game will be a class, so setup opens the menu rather than jumping straight into the game
    this.startTimestamp = Date.now();
    console.log("Game initialisation complete!");
  }

  draw() {
    this.randomObjs.cull(50, 50, 50, 50);
    this.randomObjs.amount = 10;

    // the attractive
    // this.stars.attractTo(this.player, 10)
  }
}