"use strict";

class Menu {
  constructor() {
    this.mainMenuStartedOpening = false;
    this.mainMenuOpen = false;

    this.menuSprites = new Group();
    // this.menuSprites.autoDraw = false;
    this.menuSprites.strokeWeight = 5;
    this.menuSprites.drag = 5;
    this.menuSprites.rotationLock = true;

    // menu buttons, not including the start button
    // this.menuButtons = new this.menuSprites.Group();

    // point to repel from - by default is (0,300), and (-0,-300)
    this.nodeRepelPointX = 0;
    this.nodeRepelPointY = 300;

    // menu joints
    this.menuJoints = [];

    const menuInst = this;
    // this is admittedly a bit confusing, but it's the best way to do it. i think
    /** Menu node - automatically created as a Sprite from menu.menuSprites. */
    this.MenuNode = class extends this.menuSprites.Sprite {
      constructor(spriteConstructArgs, data) {
        super(...spriteConstructArgs);

        Object.assign(this, data);

        // since sprites with no colliders have no sensors by default,
        // sensors must be added manually for mouse hover detection
        this.addDefaultSensors();

        // set default values for properties if not specified in data
        // this needs to be used instead of ??= or ||=
        // since the sprite may have these already defined 
        this.visible = data.visible ? data.visible : false;
        // this.rotation = data.rotation ? data.rotation : 45;
        if(typeof data.rotation !== 'undefined') {
          this.rotation = data.rotation;
        } else {
          this.rotation = 45;
        }

        // set fill, stroke and rotation
        this.fill = data.fill ? data.fill : color("#193095");
        this.stroke = data.stroke ? data.stroke : color("#4265fc");

        // controls scale
        this.scaleLerp ??= new LerpController(1, 1, 0.9999);
        // controls rotation
        this.rotateLerp ??= new LerpController(this.rotation, this.rotation, 0.9999);
        // controls stroke - optional
        this.strokeLerp = data.strokeLerp || null;

        // determines whether or not to set the scale target to the values below
        this.scaleWithDefaultRules = true;
        // intended scale values for hovering, pressing or default
        this.hoverScale ||= 1.1;
        this.pressedScale ||= 0.9;
        this.defaultScale ||= 1;

        // set overlap with group
        this.overlaps(menuInst.menuSprites);

        this.childrenNodes = [];

        // JOINT CONSTRUCTION
        if(this.parentNode) { // parent node already specified
          this.parentNode.childrenNodes.push(this);

          // connect!
          const joint = new DistanceJoint(this, this.parentNode);
          // access as a sprite property
          this.parentJoint = joint;
          joint.visible = false;
          // menuInst is the current menu instance
          menuInst.menuJoints.push(joint);
        }

        // once joints are connected, set a sliiight random x velocity
        // this.vel.x = random(-0.01, 0.01);
      }

      draw() {
        if(!this.visible) return;
        // if stroke lerp controller exists, use it to set the colour
        if(this.strokeLerp) this.stroke = this.strokeLerp.updateCol();

        // default draw func
        this._display();

        // update rotation
        if(this.rotateLerp) this.rotation = this.rotateLerp.update();

        if(this.scaleWithDefaultRules) {
          // change scale based on mouse hovering/pressing
          if(this.mouse.hovering()) {
            if(this.strokeLerp) this.strokeLerp.targetValue = 1;

            if(this.mouse.pressing()) {
              this.scaleLerp.targetValue = this.pressedScale;
            } else { // hovering, but not pressing
              this.scaleLerp.targetValue = this.hoverScale;
            }
          } else {
            if(this.strokeLerp) this.strokeLerp.targetValue = 0;
            this.scaleLerp.targetValue = this.defaultScale;
          }
        }

        // detect press
        if(this.mouse.pressed() && typeof this.onPressed === "function") {
          this.onPressed();
        }

        // update scale
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
    } // end of menunode class

    console.log("[MENU] Menu instance created.");
  }

  async init() {
    // init function - since constructor can't be async
    // lag is (mostly) avoided since the menu can wait until the music is loaded
    console.log(`[MENU] Initialising...`);
    // load menu music
    await loadScripts(["assets/stargazer.dzdla"]);

    // wait for a little extra time since it still lags a bit
    await sleep(200);

    // menu background colour
    this.bgcol = new ColLerpController(color("#000000"), color("#242838"), 0, 0, 0.99);
    // menu zoom controller
    this.zoomController = new LerpController(1, 1, 0.9);
    

    // START BUTTON
    this.startButton = new this.MenuNode([0, 0, 100, 100, 'n'], {
      visible: true,
      rotation: 0,
      fill: color(0,0,0,0),
      rotation: 0,
      hoverScale: 1.5,
      pressedScale: 1.3,
      strokeLerp: new ColLerpController(color("#242838"), color("#4265fc"), 0, 0, 0.999),
    });
    
    // MENU BUTTONS
    this.menuLogoCentre = new this.MenuNode([0, 0, 180, 180, 's'], {
      fill: color("#1b1c56"),
      stroke: color("#3f48cc"),
      pressedScale: 0.95,
      icondraw: (_spr) => {
        beginShape();
        vertex(-45, 40); // bottom left
        vertex(0, -70); // top
        vertex(45, 40); // bottom right
        vertex(0, 5); // bottom notch
        endShape(CLOSE);
      }
    });

    // main buttons
    this.playButton = new this.MenuNode([0, 230, 100, 100], {
      parentNode: this.menuLogoCentre,
      icondraw: (spr) => {
        push();
        fill(spr.stroke);
        triangle(
          -15, -20,
          -15, 20,
          25, 0
        );
        pop();
      },
      onPressed: () => { // close menu and start game
        this.exit();
        game = new Game();
      }
    });
    this.settingsButton = new this.MenuNode([0, 230, 100, 100], {
      parentNode: this.menuLogoCentre,
      icondraw: this.temporaryIconFunc
    });
    this.helpButton = new this.MenuNode([0, 230, 100, 100], {
      parentNode: this.menuLogoCentre,
      icondraw: this.temporaryIconFunc
    });
    this.creditsButton = new this.MenuNode([0, 230, 100, 100], {
      parentNode: this.menuLogoCentre,
      icondraw: this.temporaryIconFunc
    });
    this.statisticsButton = new this.MenuNode([0, 230, 100, 100], {
      parentNode: this.menuLogoCentre,
      icondraw: this.temporaryIconFunc
    });
    this.currentlyUselessButton = new this.MenuNode([0, 230, 100, 100], {
      parentNode: this.menuLogoCentre,
      icondraw: this.temporaryIconFunc
    });

    this.background = new ParticleBG("#4265fc");

    this.active = true;
    console.log(`[MENU] Initialisation complete!`);
  }

  openMainMenu() { // runs after the initial start button anim is done
    this.mainMenuOpen = true;
    // play teh music
    manager.assets.audio["dl.stargazer"].audio.play();
    manager.assets.audio["dl.stargazer"].audio.loop = true;
    // asdfgj
    this.zoomController.currentValue = 0.1;

    // this.menuLogoCentre.visible = true;
    this.menuSprites.visible = true;

    // CODE TO SET ORDER OF MENU NODES
    // may replace this eventually, since a lot of it isn't necessary
    // i was originally going to have an order be specified in each node constructor
    // however it would make sense for the order to just be the order each one was made in
    // since that is what it's set to
    
    const movingNodes = this.menuSprites.filter(node => node.parentNode);
    // calculate initial node velocity
    let nextOrder = 1;
    for(let enode of movingNodes) {

      if(!enode.order) {
        enode.order = nextOrder;
        nextOrder++;
      }
    }
    // determine the maximum specified order
    const maxOrder = Math.max(...movingNodes.map(node => Math.abs(node.order)));

    for(let mnode of movingNodes) {
      const vx = (mnode.order / maxOrder) * 0.01;
      mnode.vel.x = vx;
    }
  }

  draw() {
    if(!this.active) return; // menu not initialised yet

    if(camera.x !== 0 || camera.y !== 0) camera.pos = {x:0, y:0};
    camera.on();
    // change bg colour
    background(this.bgcol.updateCol());

    if(this.mainMenuOpen) { // MAIN MENU DRAW CODE HERE
      camera.off();
      // draw bg menu effects
      this.background.draw();

      // TEMPORARY - fps checker
      push();
      noStroke();
      fill(255);
      textSize(20);
      const q5fps = window.Q5 ? `(q5: avg ${manager.q5avgFPS.toFixed(0)}, c ${getFPS()})` : "";
      textAlign(LEFT, BOTTOM);
      text(`${frameRate().toFixed(0)}fps, avg ${manager.avgFPS.toFixed(0)} ${q5fps}`, 10, height - 40);
      text(`deltaTime = ${deltaTime.toFixed(0)}, avg ${Math.round(manager.avgDeltaTime * 1000)}`, 10, height - 10);
      textAlign(RIGHT, BOTTOM);
      text(`particles: ${this.background.particleList.length}, density: ${this.background.particlesPerUnitArea}`, width-10, height-40);
      text(`max dist factor: ${this.background.maxDistanceFactor}, opacity: ${this.background.opacityLerp.currentValue.toFixed(3)}`, width-10, height-10);
      pop();
      camera.on();

      // draw all joints
      for(let j of this.menuJoints) {
        push();
        stroke("#4265fc");
        strokeWeight(5);
        line(j.spriteA.x, j.spriteA.y, j.spriteB.x, j.spriteB.y);
        pop();
      }

      // repel chained menu sprites from each other
      for(let nodeA of this.menuLogoCentre.childrenNodes) {
        for(let nodeB of this.menuLogoCentre.childrenNodes) {
          if(nodeA === nodeB) continue;
          
          // gravitational force - disabled cause it's kinda useless
          // const gravconst = 300;
          // const distance = nodeA.distanceTo(nodeB);
          // let force = ((gravconst * nodeA.mass * nodeB.mass) / distance);
          // // increase repulsion force if nodes are too close
          // // if(distance < 50) force *= 5;
          // nodeA.repelFrom(nodeB, force);

          nodeA.repelFrom(nodeB, 100);
        }
        // repel from node repel points to equalise nodes a bit
        nodeA.repelFrom(this.nodeRepelPointX, this.nodeRepelPointY, 100);
        nodeA.repelFrom(-this.nodeRepelPointX, -this.nodeRepelPointY, 100);

        // absolute y value of the sprite
        const absYValue = Math.abs(nodeA.y);
        // set parent joint springiness
        const mappedValue = map(absYValue, 0, 160, 0.5, 0, true);
        nodeA.parentJoint.springiness = mappedValue;
      }
    }

    if(this.mainMenuStartedOpening) { // main menu has STARTED opening but isn't open yet

      if(this.startButton) { // remove the initial start button if it exists
        const buttoninac = (this.startButton.scaleLerp.targetValue-this.startButton.scaleLerp.currentValue).toFixed(2);
        if(buttoninac == "0.00") {
          this.startButton.remove();
          this.startButton = null;

          // animation is finished, actually open menu
          this.openMainMenu();
        }
      }

    } else { // main menu NOT open - start button draw code
  
      // tilt on hovering/unhovering
      if(this.startButton.mouse.hovers() || this.startButton.mouse.hovered()) {
        this.startButton.rotateLerp.targetValue += 45;
      }

      // after the start button is clicked
      if(this.startButton.mouse.pressed()) {
        this.startButton.rotateLerp.targetValue = 0;
        // set scale to larger out of width or height
        this.startButton.scaleLerp.targetValue = (Math.max(canvas.h+10, canvas.w+10) / 100);
        this.startButton.strokeLerp.targetValue = 1;
        this.startButton.scaleWithDefaultRules = false;

        this.mainMenuStartedOpening = true;
        this.bgcol.targetValue = 0.8;

      }
    }

    camera.off();
    // debug code - display value
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

  // getConnectedNodes(node) {
  //   if(!(node instanceof this.MenuNode)) throw new Error("Invalid MenuNode provided!");
  // }

  removeJoint(jindex) {
    if(this.menuJoints.indexOf(jindex) > -1) {
      
    } else {
      throw Error("Invalid joint index provided!");
    }
  }

  exit() {
    this.active = false;
    camera.zoom = 1;
    this.menuSprites.remove();
    manager.assets.audio["dl.stargazer"].delete();
    console.log(`[MENU] Closed.`);
  }

  temporaryIconFunc() {
    beginShape();
    vertex(0, 20);
    vertex(20, 0);
    vertex(0, -20);
    vertex(-20, 0);
    endShape(CLOSE);
  }

  windowResized(oldWidth, oldHeight, oldZoom) {
    this.background.adjust(canvas.w, canvas.h);
  }
}

class ParticleBG {
  constructor(lineCol) {
    this.opacityLerp = new LerpController(0, 128, 0.7);

    this.lineColour = lineCol ? color(lineCol) : color(255);
    // this.maxOpacity = 128;

    this.particleList = [];
    this.particlesPerUnitArea = 0.0001; // density: particles per square pixel
    this.maxDistanceFactor = 0.2; // distance factor as percentage of canvas size
    this.maxParticleCount = 250; // maximum particle count
    this.adjust(canvas.w, canvas.h);
  }

  adjust(width, height) { // run on canvas resize
    // calculate new particle count based on area and set maxDistance
    const newCount = Math.min(this.maxParticleCount, Math.floor(width * height * this.particlesPerUnitArea));
    this.maxDistance = Math.min(width, height) * this.maxDistanceFactor;

    // adjust particle count
    if(newCount > this.particleList.length) {
      // add new particles in empty areas for larger canvas
      for(let i = this.particleList.length; i < newCount; i++) {
        this.particleList.push(new ParticleBG.Particle(random(width), random(height)));
      }
    } else if(newCount < this.particleList.length) {
      // remove excess particles for smaller canvas
      this.particleList.splice(newCount);
    }

    // update all particles to stay within new bounds
    // this.particleList.forEach(p => {
    //   p.x = constrain(p.x, 0, width);
    //   p.y = constrain(p.y, 0, height);
    // });
  }

  draw() {
    const clonedColour = color(this.lineColour.levels);
    const isQ5 = !!window.Q5;

    const maxOpacity = this.opacityLerp.update();

    for(let i = 0; i < this.particleList.length; i++) {
      const p1 = this.particleList[i];
      p1.update();

      push();
      strokeWeight(4);

      // only check each pair once
      for(let j = i + 1; j < this.particleList.length; j++) {
        const p2 = this.particleList[j];
        const d = dist(p1.x, p1.y, p2.x, p2.y);

        if(d < this.maxDistance) {
          const opac = map(d, 0, this.maxDistance, maxOpacity, 0);
          if(isQ5) {
            clonedColour.a = opac;
          } else {
            clonedColour.setAlpha(opac);
          }

          stroke(clonedColour);
          line(p1.x, p1.y, p2.x, p2.y);
        }
      }
      pop();
    }
  }

  static Particle = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = random(-2, 2);
      this.vy = random(-2, 2);
    }

    update() {
      this.x = constrain(this.x + this.vx, 0, width);
      this.y = constrain(this.y + this.vy, 0, height);
      if(this.x === 0 || this.x === width) this.vx *= -1;
      if(this.y === 0 || this.y === height) this.vy *= -1;
    }
  }
}



// note - this class doesn't work fsr. use standard distancejoints for now
// class MenuJoint extends DistanceJoint {
//   constructor(spriteA, spriteB, data = {}) { // new MenuJoint(spriteA, spriteB, {strokeWeight:?, stroke:?});
//     super(spriteA, spriteB);
//     this.isMenuJoint = true;

//     Object.assign(this, data);
    
//     this.stroke ??= color(255);
//     this.strokeWeight ??= 2;

//     this.draw = (xA, yA, xB, yB) => { // for some reason this doesn't work. look into why...?
//       push();
//       stroke(this.stroke);
//       strokeWeight(this.strokeWeight);
//       if(yB) {
//         line(xA, yA, xB, yB);
//       } else {
//         point(xA, yA);
//       }
//       pop();
//     }
//   }
// }