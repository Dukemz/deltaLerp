"use strict";

class Menu {
  constructor() {
    // NOTE - move basically all the time-based stuff out of here into an async init function
    // and also put the loading of the menu music in there before everything else
    // this way lag is avoided since the menu can wait until the music is loaded
    console.log("[MENU] Menu instance created.");

    this.mainMenuOpen = false;

    this.menuSprites = new Group();
    // this.menuSprites.autoDraw = false;
    this.menuSprites.strokeWeight = 5;
    this.menuSprites.fill = color(0, 0, 0, 0);

    // menu buttons, not including the start button
    this.menuButtons = new this.menuSprites.Group();
  }

  async init() {
    console.log(`[MENU] Initialising...`);
    // load menu music
    await loadScripts(["assets/stargazer.dzdla"]);

    // menu background colour
    this.bgcol = new ColLerpController(color("#000000"), color("#242838"), 0, 0, 0.99);
    // menu zoom controller
    this.zoomController = new LerpController(1, 1, 0.9);
    
    // START BUTTON
    this.startButton = new this.menuSprites.Sprite(0, 0, 100, 100, 'n');
    // since the start button has no colliders, adding default sensor is required for mouse detection
    this.startButton.addDefaultSensors();
    // start button properties
    this.sbStroke = new ColLerpController(color("#242838"), color("#4265fc"), 0, 0, 0.999);
    this.sbRotate = new LerpController(0, 0, 0.9999);
    this.sbScale = new LerpController(0, 1, 0.9999);

    this.active = true;
    console.log(`[MENU] Initialisation complete!`);
  }

  openMainMenu() { // runs after the initial start button goes offscreen
    // play teh music
    manager.assets.audio["dl.stargazer"].audio.play();
    manager.assets.audio["dl.stargazer"].audio.loop = true;
    // asdfgj
    this.zoomController.currentValue = 0.1;

    this.menuLogoCentre.visible = true;
  }

  draw() {
    if(!this.active) return; // menu not initialised yet

    if(camera.x !== 0 || camera.y !== 0) camera.pos = {x:0, y:0};
    camera.on();
    background(this.bgcol.updateCol());

    if(this.mainMenuOpen) {
      // MAIN MENU DRAW CODE //


      if(this.startButton) { // remove the initial start button
        const buttoninac = (this.sbScale.targetValue-this.sbScale.currentValue).toFixed(2);
        if(buttoninac == "0.00") {
          this.startButton.remove();
          this.startButton = null;
          this.sbRotate = null;
          this.sbScale = null;
          this.sbStroke = null;

          // open the menu
          this.openMainMenu();
        }
      }
      // temp code to start game if s key is pressed
      if(kb.presses("s")) {
        this.exit();
        game = new Game();
      }

    } else { // START BUTTON INPUT
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

      // as soon as the start button is clicked
      if(this.startButton.mouse.pressed()) {
        this.sbRotate.targetValue = 0;
        // set scale to larger out of width or height
        this.sbScale.targetValue = (Math.max(canvas.h+10, canvas.w+10) / 100);
        this.sbStroke.targetValue = 1;

        // this.openMainMenu();
        this.mainMenuOpen = true;
        this.bgcol.targetValue = 0.8;

        // create the menu buttons and allat
        this.menuLogoCentre = new this.menuSprites.Sprite(0, 0, 100, 100, 'n');
        this.menuLogoCentre.rotation = 45;
        this.menuLogoCentre.fill = color("#1b1c56");
        this.menuLogoCentre.stroke = color("#3f48cc");
        this.menuLogoCentre.visible = false;
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

    // have to put this at the end of the function otherwise the menu button shows up before the zoom is set fsr
    if(this.active) camera.zoom = this.zoomController.update();
  }

  exit() {
    this.active = false;
    camera.zoom = 1;
    this.menuSprites.remove();
    manager.assets.audio["dl.stargazer"].delete();
    console.log(`[MENU] Closed.`);
  }
}