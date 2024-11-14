"use strict";

/**
 * deltaLerp player class.
 * @class Player
 * @typedef {Player}
 * @extends {Sprite}
 */
class Player extends Sprite {
  /**
   * Creates a new Player instance.
   * @constructor
   * @param {Object} data - Data passed to the player.
   */
  constructor(data) {
    super([
      [0, 0], // bottom notch
      [-50, 50], // bottom left
      [0, -70], // top
      [0, 0] // repeat 1st to connect
    ]);

    Object.assign(this, data);

    this.game ||= game;
    this.input ||= new kbInput();

    if(this.game.players) this.game.players.push(this);

    // player colours
    const pcols = [
      color("#6666ff"),
      color("#f44049"),
      color("#43bf8b"),
      color("#c37ee6")
    ]
    this.fill = pcols[this.game.players.indexOf(this)] || "black";

    // hopefully fixes the weird offset bug
    this.removeSensors();

    // offset for first half (this took FOREVER to get right)
    this.offset.x = -16.666;
    // second half of the thing
    this.addCollider(-16.666, 0, [[0, 0], [50, 50], [0, -70], [0, 0]]);
    this.resetCenterOfMass();

    // set attributes
    this.rotationLock = true;
    this.scale = {x: 0.5, y: 0.5};
    // this.pos = {x:0, y:0}
    // this keeps being inconsistent for some reason
    this.offset.y = -3.666;
    this.rotation = 90;
    this.strokeWeight = 0.8;
    this.stroke = this.fill;

    // custom attribs
    this.maxSpeed ||= 6;
    this.framesAlive = 0;
    this.lastWeaponCycle = 0;
    this.maxHealth = 50;
    this._health = this.maxHealth;

    // indicators like health and such - rings around the player
    this.arcindics = [];
    this.healthIndicator = new ArcIndicator(this);
    this.arcindics.push(this.healthIndicator);

    // weapons, bullets, etc
    // in future figure out how to make this into classes
    // for easier addition of new weapons, use of extends, etc
    // array of available weapon classes
    // group of all projectiles
    // allow for use with enemies as well?
    // if this.weapons is not already an array, create it
    this.weapons ||= [new MachineGun(), new Shotgun()];
    // this.activeWeapon will be the currently active weapon
    // at the end of update, call the fire function
    // the weapon class should handle everything from there
    this.projectiles ||= new this.game.playerProjectiles.Group();

    this.activeWeapon = 0;
    this.weapons.forEach(weapon => { // initialise all weapons
      weapon.initialise(this);
    });

    // for some reason these overlaps keep breaking everything
    this.overlaps(this.game.playerProjectiles);
    this.overlaps(this.game.players);
    this.projectiles.overlaps(this.game.playerProjectiles);
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = value;
    if(value <= 0) return this.delete();
    // health is 0-100, map startArc from 180 to 0
    this.healthIndicator.startArc.targetValue = map(value, 0, this.maxHealth, 180, 0, true);
  }

  directionalVelocity(angle) { // calculate velocity respective of an angle
    if(typeof angle !== "number") throw Error("Invalid or missing argument for directionalVelocity() function!");
    
    // convert from degrees to radians
    const angleRad = angle * Math.PI/180;
    const relativeVel = this.vel.x * Math.cos(angleRad) + this.vel.y * Math.sin(angleRad);
    return relativeVel;
  }

  // ~~ UPDATE FUNCTION ~~ //
  runUpdate() {
    // re-enable this if it's needed
    // this.framesAlive++;

    // counteract gravity if there is any
    if(world.gravity.y) {
      this.bearing = -90;
      this.applyForceScaled(world.gravity.y);
    }
    if(world.gravity.x) {
      this.bearing = 180;
      this.applyForceScaled(world.gravity.x);
    }

    // cull projectiles - currently disabled due to p5play bug
    // this.projectiles.cull(10,10,10,10);
    // custom cull
    for(let bullet of this.projectiles) {
      if(bullet.x > camera.x + this.game.cullZoneRight || bullet.x < camera.x - this.game.cullZoneLeft) bullet.remove();
    }

    // set new movement speed based on input
    this.vel = this.input.getMoveVel(this.maxSpeed, this.vel);

    // push player if they go offscreen
    if(this.x < camera.x - (this.game.visibleWidth/2)) {
      // this.vel.x += this.maxSpeed + this.game.cameraSpeedLerp.currentValue * 50;
      this.x += this.maxSpeed * 2 + this.game.cameraSpeedLerp.currentValue * 2;
    }
    if(this.x > camera.x + (this.game.visibleWidth/2)) {
      // this.vel.x -= this.maxSpeed - this.game.cameraSpeedLerp.currentValue * 50;
      this.x -= this.maxSpeed * 2 - this.game.cameraSpeedLerp.currentValue * 2;
    }

    // kill player if they go too far lmao
    if(this.x < camera.x - (this.game.visibleWidth/2) - 200 || this.x > camera.x + (this.game.visibleWidth/2) + 10) this.delete();

    // cycle weapon
    if(world.physicsTime - this.lastWeaponCycle > 0.7 && this.input.cycleWeapon()) {
      this.lastWeaponCycle = world.physicsTime;
      this.activeWeapon = (this.activeWeapon + 1) % this.weapons.length;
    }

    // shoot controls
    if(this.input.firing()) this.weapons[this.activeWeapon].fire();
  }

  delete() {
    if(manager.assets.audio["dl.deathsfx"]) manager.assets.audio["dl.deathsfx"].audio.play();
    this.remove();
  }

  tdebug() { // toggle debug
    if(this.debug) {
      this.debug = false;
      this.strokeWeight = 0.8;
      this.stroke = this.fill;
    } else {
      this.debug = true;
      this.strokeWeight = 1;
    }
  }

  setCol(colour) {
    if(!this.debug) {
      this.fill = colour;
      this.stroke = colour;
    }
  }

  drawSubDetails() {
    for(let a of this.arcindics) a.draw();
  }
}