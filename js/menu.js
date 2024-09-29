"use strict";

let sprite;

class Menu {
  constructor() {
    console.log("[MENU]");

    this.bgcol = new ColLerpController(color("#000000"), color("#242838"), 0, 0, 0.9);

    this.menuSprites = new Group();
    this.menuSprites.autoDraw = false;
    
    // START BUTTON
    this.startButton = new this.menuSprites.Sprite(0, 0, 100, 100, 's');
    this.startButton.strokeWeight = 5;
    this.startButton.fill = color(0,0,0,0);

    this.sbStroke = new ColLerpController(color("#242838"), color("#4265fc"), 0, 0, 0.999);
    this.sbRotate = new LerpController(0, 0, 0.999);
    this.sbScale = new LerpController(1, 1, 0.999);
  }

  draw() {
    camera.pos = {x:0, y:0};
    camera.on();
    background(this.bgcol.updateCol());

    // DRAW MENU OBJECTS
    this.startButton.draw();

    // START BUTTON UPDATE
    
    if(this.startButton.mouse.hovering()) { // on hover tilt and scale up the button
      this.sbScale.targetValue = 1.5;
      this.sbStroke.targetValue = 1;
    } else {
      this.sbScale.targetValue = 1;
      this.sbStroke.targetValue = 0;
    }

    if(this.startButton.mouse.hovers() || this.startButton.mouse.hovered()) {
      this.sbRotate.targetValue += 45;
    }

    this.startButton.rotation = this.sbRotate.update();
    const sbsc = this.sbScale.update(); // update scale
    this.startButton.scale = { x: sbsc, y: sbsc };
    this.startButton.stroke = this.sbStroke.updateCol();

    // push();
    // noStroke();
    // fill(255);
    // textSize(20);
    // textAlign(CENTER, CENTER);
    // text("Title", canvas.hw, canvas.hh);
    // pop();
  }

  exit() {
    this.menuSprites.remove();
  }
}