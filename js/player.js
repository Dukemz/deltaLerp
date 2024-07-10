"use strict";

class Player extends Sprite {
  constructor(data) {
    super([
      [0, 0], // bottom notch
      [-50, 50], // bottom left
      [0, -70], // top
      [0, 0] // repeat 1st to connect
    ]);

    /*
      [0, 0], // bottom notch
      [50, 50], // bottom right
      [0, -70], // top
      [0, 0] // repeat 1st to connect

      [0, 0], [50, 50], [0, -70], [0, 0]
    */

    Object.assign(this, data);

    // offset for first half (this took FOREVER to get right)
    this.offset.x = -16.666;
    // second half of the thing
    this.addCollider(-16.666, 0, [[0, 0], [50, 50], [0, -70], [0, 0]]);
    this.resetCenterOfMass();

    // set attributes
    this.rotationLock = true;
    this.scale = {x: 0.5, y: 0.5};
    this.pos = {x:0, y:0}
    // this keeps being inconsistent for some reason
    this.offset.y = -3.666;
    this.rotation = 90;
    this.strokeWeight = 0.2;
    this.stroke = this.fill;

    // custom attribs
    this.autoFire = false;
    this.targetSpeed ||= 6;

    // subdetails should already be created in the constructor
    this.subdetails ||= new Group();
    // indicators like health and such - rings around the player
    this.arcindics = new this.subdetails.Group();
    this.arcindics.push(new ArcIndicator(this));

    // weapons, bullets, etc
    // in future figure out how to make this into classes
    // for easier addition of new weapons, use of extends, etc
    // array of available weapon classes
    // group of all projectiles
    // allow for use with enemies as well?
    // if this.weapons is not already an array, create it
    this.weapons ||= [];
    // this.activeWeapon will be the currently active weapon
    // at the end of update, if pressing down fire key or autofire is on, call the fire function
    // the weapon class should handle everything from there
    this.projectiles ||= new Group();
    this.activeWeapon = 0;
    this.weapons.forEach(weapon => { // initialise all weapons
      weapon.initialise(this);
    });

    // this.fixlist = [];
    // for(let fxt = this.body.m_fixtureList; fxt; fxt = fxt.getNext()) {
    //   if(!fxt.isSensor()) this.fixlist.push(fxt);
    // }
  }

  directionalVelocity(angle) { // calculate velocity respective of an angle
    if(typeof angle !== "number") throw new Error("Invalid or missing argument for directionalVelocity() function!");
    
    // convert from degrees to radians
    const angleRad = angle * Math.PI/180;
    const relativeVel = this.vel.x * Math.cos(angleRad) + this.vel.y * Math.sin(angleRad);
    return relativeVel;
  }

  // ~~ UPDATE FUNCTION ~~ //
  playerUpdate() {
    // counteract gravity if there is any
    if(world.gravity.y) {
      this.bearing = -90;
      this.applyForceScaled(world.gravity.y);
    }
    if(world.gravity.x) {
      this.bearing = 180;
      this.applyForceScaled(world.gravity.x);
    }

    // cull projectiles
    this.projectiles.cull(10,10,10,10);

    // new movement system
    this.vel = this.input.getMoveVel(this.vel, this.targetSpeed);

    // toggle auto fire
    if(kb.presses("e")) this.autoFire = !this.autoFire;

    // cycle weapon
    if(kb.presses("q")) this.activeWeapon = (this.activeWeapon + 1) % this.weapons.length

    // shoot controls
    if(kb.pressing("space") || this.autoFire) this.weapons[this.activeWeapon].fire();

    // temporary testing stuff below
    if(kb.presses("q")) this.game.funnysound.play();

    if(kb.presses("m")) {
      if(game.targetCameraSpeed === 0) {
        game.targetCameraSpeed = 0.1
      } else {
        game.targetCameraSpeed = 0;
      }
    }
    if(kb.presses("b")) {
      if(game.targetCameraSpeed === 0) {
        game.targetCameraSpeed = -0.1
      } else {
        game.targetCameraSpeed = 0;
      }
    }
  }

  runUpdate() { // this is called after the sprite's internal draw function
    // difference between camera position and player position
    // const camDevX = camera.x-this.x;
    // const camDevY = camera.y-this.y;

    if(!this.game.paused) this.playerUpdate();
  }

  tdebug() { // toggle debug
    if(this.debug) {
      this.debug = false;
      this.strokeWeight = 0.2;
      this.stroke = this.fill;
    } else {
      this.debug = true;
      this.strokeWeight = 1;
    }
  }
}