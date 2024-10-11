"use strict";

class Menu {
  constructor() {
    console.log("[MENU] Initialising...");

    this.active = true;
    this.mainMenuOpen = false;

    this.bgcol = new ColLerpController(color("#000000"), color("#242838"), 0, 0, 0.99);

    this.menuSprites = new Group();
    // this.menuSprites.autoDraw = false;
    
    // START BUTTON
    this.startButton = new this.menuSprites.Sprite(0, 0, 100, 100, 'n');
    // since the start button has no colliders, adding default sensor is required for mouse detection
    this.startButton.addDefaultSensors();
    this.startButton.strokeWeight = 5;
    this.startButton.fill = color(0,0,0,0);

    this.sbStroke = new ColLerpController(color("#242838"), color("#4265fc"), 0, 0, 0.999);
    this.sbRotate = new LerpController(0, 0, 0.999);
    this.sbScale = new LerpController(0, 1, 0.999);
  }

  openMainMenu() { // runs as soon as the start button is clicked
    this.mainMenuOpen = true;
    this.bgcol.targetValue = 0.8;

    // asdfgj
  }

  draw() {
    camera.pos = {x:0, y:0};
    camera.on();
    background(this.bgcol.updateCol());

    if(this.mainMenuOpen) {
      // MAIN MENU DRAW CODE //


      if(this.startButton) { // remove the initial start button
        const buttoninac = (this.sbScale.targetValue-this.sbScale.currentValue).toFixed(3);
        if(buttoninac == "0.000") {
          this.startButton.remove();
          this.startButton = null;

          // temporary code to start the game
          this.exit();
          game = new Game();
        }
      }

    } else { // START BUTTON INPUT READING
      if(this.startButton.mouse.hovering()) {
        // if hovering
        this.sbStroke.targetValue = 1;
        if(this.startButton.mouse.pressing()) {
          // if pressing make it smaller to give a button effect sorta
          this.sbScale.targetValue = 1.3;
        } else {
          this.sbScale.targetValue = 1.5;
        }
      } else { // not hovering
        this.sbScale.targetValue = 1;
        this.sbStroke.targetValue = 0;
      }
  
      // tilt on hovering/unhovering
      if(this.startButton.mouse.hovers() || this.startButton.mouse.hovered()) {
        this.sbRotate.targetValue += 45;
      }

      // open menu
      if(this.startButton.mouse.pressed()) {
        this.sbRotate.targetValue = 0;
        // set scale to larger out of width or height
        this.sbScale.targetValue = (Math.max(canvas.h+10, canvas.w+10) / 100);
        this.sbStroke.targetValue = 1;

        this.openMainMenu();
      }
    }

    // update startbutton properties if it still exists 
    if(this.startButton && !this.startButton.removed) {
      this.startButton.rotation = this.sbRotate.update();
      const scale = this.sbScale.update(); // update scale
      this.startButton.scale = { x: scale, y: scale };
      this.startButton.stroke = this.sbStroke.updateCol();
    }

    camera.off();
    // push();
    // noStroke();
    // fill(255);
    // textSize(20);
    // textAlign(CENTER, CENTER);
    // text(`${(this.bgcol.targetValue-this.bgcol.currentValue).toFixed(3)}`, canvas.hw, canvas.hh);
    // pop();
  }

  exit() {
    this.active = false;
    this.menuSprites.remove();
    console.log(`[MENU] Closed.`);
  }
}