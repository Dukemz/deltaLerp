"use strict";

/// GAME MANAGER ///
class GameManager {
  constructor() {
    this.crashed = false;
    this.errdata = {};

    this.fpsList = [];
    this.avgFPS = 0;
    this.avgDeltaTime = 0;
    // get the current fps 10 times a second
    // used to get average FPS over the last 3 seconds
    this.fpsPush = setInterval(() => {
      this.fpsList.push(frameRate());
      if (this.fpsList.length > 30) this.fpsList.shift();
    }, 100);

    // set error handling
    // window.onerror = (event, source, lineno, colno, error) => {
    //   console.log(event)
    //   this.crash({
    //     type: "error",
    //     eventmsg: event,
    //     source, lineno, colno, error
    //   });
    // };
    addEventListener("error", (ev) => {
      const { message, filename, lineno, colno, error } = ev;
      console.log(ev)
      this.crash({
        type: "error",
        eventmsg: message,
        source: filename,
        lineno, colno, error
      });
    });

    // unhandled promise rejection
    addEventListener("unhandledrejection", (event) => {
      this.crash({ type: "promiseReject", event });
    });
  }

  crash(data) { // data is an object, should contain error
    if(!this.crashed) {
      this.crashed = true;
    } else {
      console.error(`WARNING: Attempted to handle a crash on frame ${frameCount} while the game was already crashed (frame ${this.errdata.crashFrame}).`);
    }
    this.errdata = data || {};
    this.errdata.crashFrame = frameCount;
    noLoop();
    
    this.setMessage();
    this.crashlog();
    this.crashdraw();
  }

  setMessage() { // set this.errmsg based on data in this instance
    let msg = ``;
    // error type
    if(this.errdata.type === "promiseReject") {
      msg += `Unhandled promise rejection: ${this.errdata.event.reason}`;
    } else if(this.errdata.type === "setupError") {
      msg += `Game setup failed to complete.\n${this.errdata.error.name}: ${this.errdata.error.message}\n`;
    } else if(this.errdata.type === "error") {
      msg += `An uncaught exception occurred.\n`;
      if(this.errdata.error) {
        msg += `${this.errdata.error.name}: ${this.errdata.error.message}\n`;
      } else if(this.errdata.eventmsg) {
        msg += `Event message: ${this.errdata.eventmsg}\n`;
      } else {
        msg += `No error data.\n`;
      }
    } else {
      msg += `Invalid or no error type.\n`;
    }

    if(this.errdata.error) {
      if(this.errdata.fileName) {
        msg += `Source: ${this.errdata.fileName}\nLine ${this.errdata.lineNumber}, col ${this.errdata.columnNumber}`;
      } else if(this.errdata.error.fileName) {
        msg += `Source: ${this.errdata.error.fileName}\nLine ${this.errdata.error.lineNumber}, col ${this.errdata.error.columnNumber}`;
      } else if(this.source) {
        msg += `Source: ${this.source}`
      } else {
        msg += `Unable to provide more error information.`;
      }
    } else {
      msg += `No error data available.`;
    }
    if(navigator.userAgent.indexOf("Firefox") === -1) {
      msg += `\n\nNote: If little or no error data is provided, try running the game in Firefox for additional debug information.`;
    }

    this.errmsg = msg;
  }

  crashlog() { // log crash report to console
    let msg = `%coh no\n%c${this.errmsg}`;
    console.error(msg, "font-size: 27px", "");
    if(this.errdata.error) console.error(this.errdata.error.stack);
  }

  crashdraw() { // draw crash report to the canvas
    camera.off();

    push();
    background(0, 0, 0, 200);
    noStroke();
    fill(255, 90, 100);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textWrap(WORD);
    textSize(20);

    const maxtextwidth = canvas.w - 20;
    let msg = `${this.errmsg}\n\nPlease check the console for more details.`;
    text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
    textStyle(NORMAL);
    text(msg, 10, 40, maxtextwidth);

    pop();
  }
}



/// RESIZEANDZOOM ///
function windowResized() {
  const oldWidth = canvas.w;
  const oldHeight = canvas.h;
  const oldZoom = camera.zoom;
  // resize canvas to fit the new window size
  canvas.resize(windowWidth - 50, windowHeight - 50);

  if(manager.crashed) {
    console.log("Redrawing crash handler data.");
    manager.crashdraw();
  } else {
    // change zoom
    // const setZoom = canvas.w / 1400;
    const setZoom = calculateZoom(canvas.w, canvas.h, 1500);
    camera.zoom = setZoom;
    console.log(`Resized! [${oldWidth}, ${oldHeight}] => [${canvas.w}, ${canvas.h}]\nZoom: [${oldZoom.toFixed(3)}] => [${setZoom.toFixed(3)}]`);
    
    // set the bg colour again to avoid that weird messy effect
    manager.opaquebgcol = color(red(manager.bgcol), green(manager.bgcol), blue(manager.bgcol));
    background(manager.opaquebgcol);
  }
}

function calculateZoom(currentWidth, currentHeight, maxWidth) {
  const defaultWidth = 1000;
  const defaultHeight = 652;
  // Calculate the width and height ratios
  const widthRatio = currentWidth / defaultWidth;
  const heightRatio = currentHeight / defaultHeight;
  
  // Calculate the initial zoom based on the average ratio
  let newZoom = (widthRatio + heightRatio) / 2;

  // Calculate the visible width based on the new zoom
  let visibleWidth = currentWidth / newZoom;

  // If the visible width exceeds the maximum allowed width, adjust the zoom
  if (visibleWidth > maxWidth) {
    newZoom = currentWidth / maxWidth;
  }

  return newZoom;
}

// calculate camera bounds
function calculateBounds(canvasWidth, canvasHeight, zoom) {
  // calculate the visible width and height based on the zoom level
  const visibleWidth = canvasWidth / zoom;
  const visibleHeight = canvasHeight / zoom;

  // assuming the camera is centered, calculate the bounds
  const halfVisibleWidth = visibleWidth / 2;
  const halfVisibleHeight = visibleHeight / 2;

  // define the bounds as top-left and bottom-right coordinates
  const bounds = {
    topLeft: {
      x: -halfVisibleWidth,
      y: -halfVisibleHeight
    },
    bottomRight: {
      x: halfVisibleWidth,
      y: halfVisibleHeight
    }
  };

  return bounds;
}



/// GAMEHUD ///

class GameHUD {
  constructor() {
    this.tophudoffset = 0;
  }

  draw() {
    push();
    noStroke();
    fill(255);
    textSize(20);
    
    // top left HUD
    textAlign(LEFT, TOP);
    text(`frames: ${frameCount}`, 10, 10);
    text(`realtime: ${world.realTime.toFixed(3)}, physics: ${world.physicsTime.toFixed(3)}`, 10, 40);
    // top right HUD
    textAlign(RIGHT, TOP);
    text(`player: ${Math.round(player.x)}, ${Math.round(player.y)} || mouse: ${Math.round(mouse.x)}, ${Math.round(mouse.y)}`, width-10, 10);
    text(`bullets fired: ${player.weapons[player.activeWeapon].bulletsFired}, total ${player.projectiles.amount}`, width-10, 40);
    // bottom left HUD
    textAlign(LEFT, BOTTOM);
    text(`${frameRate().toFixed(0)}fps, avg ${manager.avgFPS.toFixed(0)}`, 10, height-40);
    text(`deltaTime = ${deltaTime.toFixed(0)}, avg ${Math.round(manager.avgDeltaTime*1000)}`, 10, height-10);
    // bottom right HUD
    textAlign(RIGHT, BOTTOM);
    text(`speed: ${player.speed.toFixed(3)}`, width-10, height-70);
    text(`seek: ${game.funnysound.seek().toFixed(3)}`, width-10, height-40);
    text(`direction: ${player.direction.toFixed(3)}`, width-10, height-10);

    if(game.paused) {
      textAlign(CENTER, CENTER);
      text("[Paused - press P to unpause]", canvas.hw, canvas.hh);
    }
    pop();
  }
}



/// ARCINDICATOR ///
class ArcIndicator extends Sprite { // arc indicator thing
  // may be used to show health, forcefield or etc
  // multiple arc layers, each with their own color, size, etc?
  constructor(parent) {
    // sprite constructor
    // x, y, width, height
    super(parent.x, parent.y, 85);
    // parent sprite to attach to
    this.parent = parent;
    // set properties
    this.collider = "none";
    this.layer = parent.layer - 1;
    this.stroke = color(255);
    this.strokeWeight = 2;
    this.autoDraw = false;

    this.start = 0;
    this.targetStart = 0;
    this.startLerpAmount = 0.8;
    this.stop = 0;
    this.targetStop = 180;
    this.stopLerpAmount = 0.8;
  }

  draw() {
    // set position to parent
    this.pos = this.parent.pos;
    
    push();
    noFill();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight)
    arc(this.x, this.y, this.diameter, this.diameter, this.start, this.stop);
    pop();
  }

  runUpdate() {
    // using normal lerp for this since the time difference doesn't matter so much
    if(this.start !== this.targetStart) this.start = deltaLerp(this.start, this.targetStart, this.startLerpAmount);
    if(this.stop !== this.targetStop) this.stop = deltaLerp(this.stop, this.targetStop, this.stopLerpAmount);
  }
}




/// MACHINEGUN ///
class machineGun {
  // machine gun weapon - fires multiple small bullets in quick succession
  // this group represents all the bullets
  constructor() {
    // ~~ TRACKING ~~ //
    // stores timestamp of last time a bullet was fired
    this.lastFired = 0;
    // total bullets fired
    this.bulletsFired = 0;
    this.fireRate = 80; // time between firing in ms
  }

  initialise(player) {
    this.group = new player.projectiles.Group();

    // ~~ PROPERTIES ~~ //
    // sprite soft & dynamic inheritance properties
    this.group.diameter = 10;
    this.group.x = () => player.x + 15;
    this.group.y = () => player.y;
    this.group.vel.x = 20; // bullet velocity
    // bouncy
    this.bounciness = 1;
    // visual properties
    this.group.fill = player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;

    // todo: figure out how to make bullets always shoot from the tip of the player
    // and travel in the right direction accordingly

    // bullets overlap with the player
    this.group.overlaps(player);
    // // thing to remove bullets if they touch player, but it's unnecessary
    // {
    //   const life = 2147483647 - b.life;
    //   if(life > 10) b.remove();
    // }
  } 

  fire() { // FIRE IN THE HOLE
    // note that a bullet may not always be fired every time this function is called
    // this is just called at the end of player update if the player is currently requesting to fire

    // elapsed time since last bullet fired
    const elapseFired = world.physicsTime*1000 - this.lastFired;
    if(elapseFired > this.fireRate) {
      const bullet = new this.group.Sprite();
      // set bullet's update function since for some reason you can't define it before
      bullet.update = () => {
        if(bullet.speed < 3) bullet.remove();
      }
      this.bulletsFired++;
      this.lastFired = world.physicsTime*1000;
      if(this.group.amount > 20) {
        this.group[0].remove();
      }
    }
    // culling - remove bullets if they go more than 10 units offscreen
    // note - if screen size is changed then cull boundary changes too
    // this.group.cull(50, 50, 50, 50);
  }
}

// old method of parent checking
// this = new Group();
// this.weapons.subgroups.push(this);
// this.parent = this.weapons.idNum;



/// KBINPUT ///

class kbInput {
  constructor(data) {
    Object.assign(this, data);
    // data = {
    //   up: "W",
    //   down: "S"
    //   // etc...
    // }
    this.up ||= "up";
    this.down ||= "down";
    this.left ||= "left";
    this.right ||= "right";
    this.slow ||= "shift";

    // todo: migrate other actions to here too, like shoot, autofire, etc
  }

  isMoving() {
    return (kb.pressing(this.up) || kb.pressing(this.down) || kb.pressing(this.left) || kb.pressing(this.right))
  }

  getMoveVel(currentVel, targetSpeed) { // get vector for velocity
    let vector = createVector(targetSpeed, 0);

    if(kb.pressing(this.up) && kb.pressing(this.right)) {
      vector.setHeading(-45);
    } else if(kb.pressing(this.up) && kb.pressing(this.left)) {
      vector.setHeading(-135);
    } else if(kb.pressing(this.down) && kb.pressing(this.right)) {
      vector.setHeading(45);
    } else if(kb.pressing(this.down) && kb.pressing(this.left)) {
      vector.setHeading(135);
    } else if(kb.pressing(this.up)) {
      vector.setHeading(-90);
    } else if(kb.pressing(this.down)) {
      vector.setHeading(90);
    } else if(kb.pressing(this.right)) {
      vector.setHeading(0);
    } else if(kb.pressing(this.left)) {
      vector.setHeading(180);
    }

    // there's probably a much more efficient way to do this but whatever
    if(!kb.pressing(this.left) && !kb.pressing(this.right)) {
      vector.x = deltaLerp(currentVel.x, 0, 0.99999);
    }
    if(!kb.pressing(this.up) && !kb.pressing(this.down)) {
      vector.y = deltaLerp(currentVel.y, 0, 0.99999);
    }
    if(kb.pressing(this.slow)) { // hold shift to slow down
      // decrease the vector's magnitude
      vector.setMag(vector.mag()/2);
    }
    return vector;
  }
}



/// PLAYER ///

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
    if(typeof angle !== "number") throw Error("Invalid or missing argument for directionalVelocity() function!");
    
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



/// GAME ///

class Game { // game class
  // in future, create instance for every new stage
  // maybe stage scripts will extend the game class?
  constructor(data) {
    console.log("[NEW GAME]");
    Object.assign(this, data);
    this.active = true;

    // camera config
    this.cameraSpeed = 0;
    this.targetCameraSpeed = 0;
    this.cameraLerpAmount = 0.5;
    this.camPos = { x: 0, y: 0 };

    // pause config
    this.setPaused = false;
    this.paused = false;
    this.timeScale = 1;

    // heads-up display, info like framerate and things
    this.hud = new GameHUD();

    // GROUP STRUCTURE //
    // - players
    // - projectiles
    // - objects

    // all physical objects in the game that aren't players or projectiles
    this.objects = new Group();
    this.objects.stroke = "white";
    this.objects.strokeWeight = 2

    // all players
    this.players = new Group();
    // group of all player details e.g. shields and such
    this.playerDetails = new Group();
    this.projectiles = new Group();

    // set main player if it doesn't exist
    window.player ||= new Player({
      game: this,
      projectiles: new this.projectiles.Group(),
      subdetails: new this.playerDetails.Group(),
      layer: 1,
      fill: color(122, 122, 255),
      input: new kbInput(),
      weapons: [
        new machineGun()
      ]
    });

    // in future this.player won't exist
    // at the moment the game is only single-player though
    this.players.push(player);

    // wall test - vertex mode
    this.walls = new this.objects.Group();
    this.walls.collides(this.projectiles, (_w, p) => p.remove());

    this.wall = new this.walls.Sprite([[100, 100], [200, -100]], 's');
    this.wall2 = new this.walls.Sprite([[-100, -100], [-100, 100]], 's');

    // goober test
    this.thingy = new this.objects.Sprite(-canvas.hw+50,-150, 30, 30);
    this.thingy.vel.x = 1

    this.funnysound = new Howl({
      src: ['./assets/quackmp3.mp3'],
      html5: true,
      autoplay: false
    });

    // just move the camera to center, why not?
    camera.pos = { x: 0, y: 0 };

    // disable auto draw and auto update
    this.players.autoDraw = false;
    this.objects.autoDraw = false;
    this.projectiles.autoDraw = false;

    const setZoom = calculateZoom(canvas.w, canvas.h, 1500);
    camera.zoom = setZoom;
    // calculate bounds
    const camBounds = calculateBounds(canvas.w, canvas.h, setZoom);

    // bounds box for debug
    // this.boundsbox = new this.objects.Sprite([
    //   [camBounds.topLeft.x, camBounds.topLeft.y],
    //   [camBounds.bottomRight.x, camBounds.topLeft.y],
    //   [camBounds.bottomRight.x, camBounds.bottomRight.y],
    //   [camBounds.topLeft.x, camBounds.bottomRight.y],
    //   [camBounds.topLeft.x, camBounds.topLeft.y]
    // ]);
    this.boundsbox = new this.objects.Sprite(0, 0, 1500, canvas.h);
    this.boundsbox.overlaps(allSprites);
    this.boundsbox.layer = 0;
    this.boundsbox.colour.setAlpha(1);

    // save timestamp on when the thing starts
    // main.js setup will open the menu rather than jumping straight into the game
    // new Game() will be called when entering a level
    this.startTimestamp = Date.now();
    console.log("Game initialisation complete!");
  }

  draw() { // runs at the end of the main draw function
    
    // pause logic
    if(kb.presses("p")) this.setPaused = !this.setPaused;

    if(this.setPaused) {
      this.paused = true;
    } else if(document.visibilityState !== "visible") {
      this.paused = true;
    } else {
      this.paused = false;
    }

    if(this.paused) {
      world.timeScale = 0;
    } else {
      world.timeScale = this.timeScale;

      // calculation for camera movement
      // this is about as accurate as i can make it lol
      this.camPos.x += this.cameraSpeed * deltaTime;
      if(this.cameraSpeed !== this.targetCameraSpeed) {
        this.cameraSpeed = deltaLerp(this.cameraSpeed, this.targetCameraSpeed, this.cameraLerpAmount);
      }
    }

    // draw sprites
    camera.on();
    this.projectiles.draw();
    this.objects.draw();
    this.playerDetails.draw();
    this.players.draw();
    // hud is drawn last and with the camera disabled
    camera.off();
    this.hud.draw();
    camera.on();

    // update sprites
    this.playerDetails.runUpdate();
    this.players.runUpdate();

    // crash lol
    if(kb.presses("c")) throw Error("Congrats, you found the crash button!");
  }

  exit() { // close game, remove all sprites.
    // game cannot be reused after this
    this.players.remove();
    this.playerDetails.remove();
    this.objects.remove();
    this.projectiles.remove();
    this.hud.remove();
    this.draw = () => {};
    this.active = false;
  }
}