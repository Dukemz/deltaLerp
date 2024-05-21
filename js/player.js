"use strict";

class Player extends Sprite {
  constructor(...data) {
    console.log(data);
    super([ // vertex mode
      [-50, 50], // bottom left
      [0, -70], // top
      [50, 50], // bottom right
      [0, 0], // bottom notch
      [-50, 50] // repeat 1st to connect
    ]);
    this.movementPressed = false;
    this.originX = 0;
    this.originY = 0;
    // for gravity counter-action
    this.bearing = -90;

    // weapons, bullets, etc
    this.weapons = new Group();
    this.bullets = new this.weapons.Group();
    this.bullets.diameter = 10;
    this.bullets.x = () => this.x + 40;
    this.bullets.y = () => this.y;
    this.bullets.vel.x = 10;
    this.bullets.lastFired = 0;

    // set attributes
    this.offset.y = 9;
    this.rotation = 90;
    this.scale = {x: 0.5, y: 0.5};
    this.strokeWeight = 1;
    this.stroke = color(122, 122, 255);
  }

  directionalVelocity(angle) { // calculate velocity respective of an angle
    if(typeof angle !== "number") throw new Error("Invalid or missing argument for directionalVelocity() function!");
    
    // convert from degrees to radians
    const angleRad = angle * Math.PI/180;
    const relativeVel = this.vel.x * Math.cos(angleRad) + this.vel.y * Math.sin(angleRad);
    return relativeVel;
  }

  // ~~ UPDATE FUNCTION ~~ //
  // called after draw
  update() {
    // difference between camera position and player position
    const camDevX = camera.x-this.x;
    const camDevY = camera.y-this.y;

    // counteract gravity
    if(world.gravity.y) this.applyForceScaled(world.gravity.y);

    // movement
    if(kb.pressing("up")) {
      this.vel.y = -5;
    } else if(kb.pressing("down")) {
      this.vel.y = 5;
    } else {
      this.vel.y = deltaLerp(this.vel.y, 0, 0.001);
    }
    if(kb.pressing("left")) {
      this.vel.x = -5;
    } else if(kb.pressing("right")) {
      this.vel.x = 5;
    } else {
      this.vel.x = deltaLerp(this.vel.x, 0, 0.001);
    }

    // shoot controls
    // elapsed time since last bullet fired
    const elapseFired = Date.now() - this.bullets.lastFired;
    if(kb.pressing("space") && elapseFired > 100) {
      new this.bullets.Sprite();
      this.bullets.lastFired = Date.now();
      if(this.bullets.amount > 10) {
        this.bullets[0].remove();
      }
    }
  }
}