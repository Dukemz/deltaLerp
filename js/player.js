class Player extends Sprite {
  constructor(...data) {
    super(...data);
    this.isAccelerating = false;
    this.originX = 0;
    this.originY = 0;

    // set col
    this.colour = color(55, 55, 134);
  }

  getMovementInput() { // return the directions being pressed as an array
    const beingPressed = [];
    const directions = ['up', 'down', 'left', 'right'];
    directions.forEach(dir => {
      if(kb.pressing(dir)) beingPressed.push(dir);
    });
    this.isAccelerating = beingPressed.size === 0;
    return beingPressed;
  }

  directionalVelocity(angle) { // calculate velocity respective of an angle
    if(typeof angle !== "number") throw new Error("Invalid or missing argument for directionalVelocity() function!");
    
    // convert from degrees to radians
    const angleRad = angle * Math.PI/180;
    const relativeVel = this.vel.x * Math.cos(angleRad) + this.vel.y * Math.sin(angleRad);
    return relativeVel;
  }

  // ~~ UPDATE FUNCTION ~~ //
  // fairly certain this is called after the internal draw?
  update() {
    // difference between camera position and player position
    const camDevX = camera.x-this.x;
    const camDevY = camera.y-this.y;

    if(this.mouse.hovering()) {
      mouse.cursor = 'grab';
    } else {
      mouse.cursor = 'default';
    }

    // ellipse drawn using new canvasPos feature
    ellipse(this.canvasPos.x, this.canvasPos.y, 20)
  }
}