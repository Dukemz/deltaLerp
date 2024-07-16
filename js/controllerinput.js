"use strict";

class controllerInput {
  constructor(data) {
    Object.assign(this, data);
    // data = {
    //   up: "w",
    //   down: "s"
    //   // etc...
    // }
    this.inputType = "controller";

    // directional movement
    this.contro ||= window.contro;
    this.c ||= {};
    this.c.up ||= "up";
    this.c.down ||= "down";
    this.c.left ||= "left";
    this.c.right ||= "right";

    // analog stuff
    this.deadzone = 0.3;

    // fire controls
    this.c.fire ||= "r";
    this.c.autoFire ||= "a";
    this.c.cycleWeapon ||= "x";

    this.autoFireEnabled = false;
  }

  // input checks //
  firing() {
    // toggle autofire enabled
    if(this.contro.presses(this.c.autoFire)) this.autoFireEnabled = !this.autoFireEnabled;
    return this.autoFireEnabled || this.contro.pressing(this.c.fire);
  }
  cycleWeapon() { return this.contro.presses(this.c.cycleWeapon) }


  // other methods //

  isMoving() {
    return this.dPadMoving() || this.analogMoving();
  }

  analogMoving() {
    const stickVector = createVector(this.contro.leftStick.x, this.contro.leftStick.y);
    return stickVector.mag() > this.deadzone;
  }

  dPadMoving() {
    return (this.contro.pressing(this.c.up) || this.contro.pressing(this.c.down) || this.contro.pressing(this.c.left) || this.contro.pressing(this.c.right));
  }


  // move velocity //

  getMoveVel(targetSpeed, currentVel) {
    if(this.analogMoving()) {
      return this.analogMoveVel(targetSpeed);
    } else {
      return this.dPadMoveVel(targetSpeed, currentVel);
    }
  }

  analogMoveVel(targetSpeed) {
    const stickVector = createVector(this.contro.leftStick.x, this.contro.leftStick.y);
    // void input if under deadzone
    if(stickVector.mag() > this.deadzone) {
      // targetVector.setHeading(stickVector.heading());

      // normalize
      // this solution isn't the best but it's good enough
      if(stickVector.mag() > 1) stickVector.normalize();
      // multiply by target speed
      stickVector.mult(targetSpeed);


    } else {
      stickVector.setMag(0);
    }
    return stickVector;
  }

  dPadMoveVel(targetSpeed, currentVel) { // get vector for velocity using d-pad
    let vector = createVector(targetSpeed, 0);

    if(this.contro.pressing(this.c.up) && this.contro.pressing(this.c.right)) {
      vector.setHeading(-45);
    } else if(this.contro.pressing(this.c.up) && this.contro.pressing(this.c.left)) {
      vector.setHeading(-135);
    } else if(this.contro.pressing(this.c.down) && this.contro.pressing(this.c.right)) {
      vector.setHeading(45);
    } else if(this.contro.pressing(this.c.down) && this.contro.pressing(this.c.left)) {
      vector.setHeading(135);
    } else if(this.contro.pressing(this.c.up)) {
      vector.setHeading(-90);
    } else if(this.contro.pressing(this.c.down)) {
      vector.setHeading(90);
    } else if(this.contro.pressing(this.c.right)) {
      vector.setHeading(0);
    } else if(this.contro.pressing(this.c.left)) {
      vector.setHeading(180);
    }

    // there's probably a much more efficient way to do this but whatever
    if(!this.contro.pressing(this.c.left) && !this.contro.pressing(this.c.right)) {
      vector.x = deltaLerp(currentVel.x, 0, 0.99999);
    }
    if(!this.contro.pressing(this.c.up) && !this.contro.pressing(this.c.down)) {
      vector.y = deltaLerp(currentVel.y, 0, 0.99999);
    }
    return vector;
  }
}