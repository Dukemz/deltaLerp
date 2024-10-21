"use strict";

class Menu {
  constructor() {
    this.mainMenuOpen = false;

    this.menuSprites = new Group();
    // this.menuSprites.autoDraw = false;
    this.menuSprites.strokeWeight = 5;
    this.menuSprites.fill = color(0, 0, 0, 0);

    // menu buttons, not including the start button
    this.menuButtons = new this.menuSprites.Group();

    // this is admittedly a bit confusing, but it's the best way to do it. i think
    this.MenuNode = class extends this.menuSprites.Sprite {
      constructor(spriteConstructArgs, data) {
        super(...spriteConstructArgs);

        Object.assign(this, data);

        // add default sensors for mouse hover detection
        this.addDefaultSensors();

        // set fill, stroke and rotation if not specified in data
        this.fill = data.fill ? data.fill : color("#1b1c56");
        this.stroke = data.stroke ? data.stroke : color("#3f48cc");
        this.rotation = data.rotation ? data.rotation : 45;

        // controls scale
        this.scaleLerp ||= new LerpController(1, 1, 0.9999);
      }

      draw() {
        if(!this.visible) return;
        // default draw func
        this._display();

        if(this.mouse.hovering()) {
          if(this.mouse.pressing()) {
            this.scaleLerp.targetValue = 0.9;
          } else { // hovering, but not pressing
            this.scaleLerp.targetValue = 1.1;
          }
        } else {
          this.scaleLerp.targetValue = 1;
        }

        const sc = this.scaleLerp.update();
        this.scale = { x: sc, y: sc };

        // draw shape that goes on top
        if(this.icondraw) {
          push();
          fill(this.fill);
          stroke(this.stroke);
          strokeWeight(this.strokeWeight);
          translate(this.x, this.y);
          scale(this.scale.x, this.scale.y);
          this.icondraw(this);
          pop();
        }
      }
    }
    console.log("[MENU] Menu instance created.");
  }

  async init() {
    // init function - since constructor can't be async
    // lag is (mostly) avoided since the menu can wait until the music is loaded
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
    // NOTE: maybe replace this with rotateTo/rotateTowards
    this.sbRotate = new LerpController(0, 0, 0.9999);
    this.sbScale = new LerpController(0, 1, 0.9999);

    this.menuLogoCentre = new this.MenuNode([0, 0, 180, 180, 'n'], {
      visible: false,
      icondraw: function (spr) {
        beginShape();
        vertex(-50, 40); // bottom left
        vertex(0, -70); // top
        vertex(50, 40); // bottom right
        vertex(0, 0); // bottom notch
        endShape(CLOSE);
      }
    });

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

    if(camera.x !== 0 || camera.y !== 0) camera.pos = { x: 0, y: 0 };
    camera.on();
    // change bg colour
    background(this.bgcol.updateCol());

    if(this.mainMenuOpen) {
      // MAIN MENU DRAW CODE //


      if(this.startButton) { // remove the initial start button if it exists
        const buttoninac = (this.sbScale.targetValue - this.sbScale.currentValue).toFixed(2);
        if(buttoninac == "0.00") {
          this.startButton.remove();
          this.startButton = null;
          this.sbRotate = null;
          this.sbScale = null;
          this.sbStroke = null;

          // open the menu - this.mainMenuOpen returns true even if menu buttons and such don't exist yet
          this.openMainMenu();
        }
      }

      // temp code to start game if s key is pressed
      if(kb.presses("s")) {
        this.exit();
        game = new Game();
      }

    } else { // main menu NOT open - start button draw code
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

      // after the start button is clicked
      if(this.startButton.mouse.pressed()) {
        this.sbRotate.targetValue = 0;
        // set scale to larger out of width or height
        this.sbScale.targetValue = (Math.max(canvas.h + 10, canvas.w + 10) / 100);
        this.sbStroke.targetValue = 1;

        // this.openMainMenu();
        this.mainMenuOpen = true;
        this.bgcol.targetValue = 0.8;

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