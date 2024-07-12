// main script
"use strict";
console.log("[HELLO WORLD]");
const version = "pre-alpha OFLV";

// will hold game instance
let game;

function preload() {
  // this function doesn't do much, but it's called before setup
  // console log helps with debugging 
  console.log("[PRELOAD]");
  noLoop();
}

async function setup() {
  console.log("[SETUP]");
  document.getElementById("loadtext").innerHTML = "loading scripts...";
  try {
    "use strict";class GameManager{constructor(){this.crashed=!1,this.errdata={},this.fpsList=[],this.avgFPS=0,this.avgDeltaTime=0,this.fpsPush=setInterval((()=>{this.fpsList.push(frameRate()),this.fpsList.length>30&&this.fpsList.shift()}),100),addEventListener("error",(e=>{const{message:t,filename:s,lineno:r,colno:i,error:a}=e;console.log(e),this.crash({type:"error",eventmsg:t,source:s,lineno:r,colno:i,error:a})})),addEventListener("unhandledrejection",(e=>{this.crash({type:"promiseReject",event:e})}))}crash(e){this.crashed?console.error(`WARNING: Attempted to handle a crash on frame ${frameCount} while the game was already crashed (frame ${this.errdata.crashFrame}).`):this.crashed=!0,this.errdata=e||{},this.errdata.crashFrame=frameCount,noLoop(),this.setMessage(),this.crashlog(),this.crashdraw()}setMessage(){let e="";"promiseReject"===this.errdata.type?e+=`Unhandled promise rejection: ${this.errdata.event.reason}`:"setupError"===this.errdata.type?e+=`Game setup failed to complete.\n${this.errdata.error.name}: ${this.errdata.error.message}\n`:"error"===this.errdata.type?(e+="An uncaught exception occurred.\n",this.errdata.error?e+=`${this.errdata.error.name}: ${this.errdata.error.message}\n`:this.errdata.eventmsg?e+=`Event message: ${this.errdata.eventmsg}\n`:e+="No error data.\n"):e+="Invalid or no error type.\n",this.errdata.error?this.errdata.fileName?e+=`Source: ${this.errdata.fileName}\nLine ${this.errdata.lineNumber}, col ${this.errdata.columnNumber}`:this.errdata.error.fileName?e+=`Source: ${this.errdata.error.fileName}\nLine ${this.errdata.error.lineNumber}, col ${this.errdata.error.columnNumber}`:this.source?e+=`Source: ${this.source}`:e+="Unable to provide more error information.":e+="No error data available.",-1===navigator.userAgent.indexOf("Firefox")&&(e+="\n\nNote: If little or no error data is provided, try running the game in Firefox for additional debug information."),this.errmsg=e}crashlog(){let e=`%coh no\n%c${this.errmsg}`;console.error(e,"font-size: 27px",""),this.errdata.error&&console.error(this.errdata.error.stack)}crashdraw(){camera.off(),push(),background(0,0,0,200),noStroke(),fill(255,90,100),textAlign(LEFT,TOP),textStyle(BOLD),textWrap(WORD),textSize(20);const e=canvas.w-20;let t=`${this.errmsg}\n\nPlease check the console for more details.`;text("Whoops, looks like something went wrong.",10,10,e),textStyle(NORMAL),text(t,10,40,e),pop()}}function windowResized(){const e=canvas.w,t=canvas.h,s=camera.zoom;if(canvas.resize(windowWidth-50,windowHeight-50),manager.crashed)console.log("Redrawing crash handler data."),manager.crashdraw();else{const r=calculateZoom(canvas.w,canvas.h,1500);camera.zoom=r,console.log(`Resized! [${e}, ${t}] => [${canvas.w}, ${canvas.h}]\nZoom: [${s.toFixed(3)}] => [${r.toFixed(3)}]`),manager.opaquebgcol=color(red(manager.bgcol),green(manager.bgcol),blue(manager.bgcol)),background(manager.opaquebgcol)}}function calculateZoom(e,t,s){let r=(e/1e3+t/652)/2;return e/r>s&&(r=e/s),r}function calculateBounds(e,t,s){const r=e/s/2,i=t/s/2;return{topLeft:{x:-r,y:-i},bottomRight:{x:r,y:i}}}class GameHUD{constructor(){this.tophudoffset=0}draw(){push(),noStroke(),fill(255),textSize(20),textAlign(LEFT,TOP),text(`frames: ${frameCount}`,10,10),text(`realtime: ${world.realTime.toFixed(3)}, physics: ${world.physicsTime.toFixed(3)}`,10,40),textAlign(RIGHT,TOP),text(`player: ${Math.round(player.x)}, ${Math.round(player.y)} || mouse: ${Math.round(mouse.x)}, ${Math.round(mouse.y)}`,width-10,10),text(`bullets fired: ${player.weapons[player.activeWeapon].bulletsFired}, total ${player.projectiles.amount}`,width-10,40),textAlign(LEFT,BOTTOM),text(`${frameRate().toFixed(0)}fps, avg ${manager.avgFPS.toFixed(0)}`,10,height-40),text(`deltaTime = ${deltaTime.toFixed(0)}, avg ${Math.round(1e3*manager.avgDeltaTime)}`,10,height-10),textAlign(RIGHT,BOTTOM),text(`speed: ${player.speed.toFixed(3)}`,width-10,height-70),text(`seek: ${game.funnysound.seek().toFixed(3)}`,width-10,height-40),text(`direction: ${player.direction.toFixed(3)}`,width-10,height-10),game.paused&&(textAlign(CENTER,CENTER),text("[Paused - press P to unpause]",canvas.hw,canvas.hh)),pop()}}class ArcIndicator extends Sprite{constructor(e){super(e.x,e.y,85),this.parent=e,this.collider="none",this.layer=e.layer-1,this.stroke=color(255),this.strokeWeight=2,this.autoDraw=!1,this.start=0,this.targetStart=0,this.startLerpAmount=.8,this.stop=0,this.targetStop=180,this.stopLerpAmount=.8}draw(){this.pos=this.parent.pos,push(),noFill(),stroke(this.stroke),strokeWeight(this.strokeWeight),arc(this.x,this.y,this.diameter,this.diameter,this.start,this.stop),pop()}runUpdate(){this.start!==this.targetStart&&(this.start=deltaLerp(this.start,this.targetStart,this.startLerpAmount)),this.stop!==this.targetStop&&(this.stop=deltaLerp(this.stop,this.targetStop,this.stopLerpAmount))}}class machineGun{constructor(){this.lastFired=0,this.bulletsFired=0,this.fireRate=80}initialise(e){this.group=new e.projectiles.Group,this.group.diameter=10,this.group.x=()=>e.x+15,this.group.y=()=>e.y,this.group.vel.x=20,this.bounciness=1,this.group.fill=e.fill,this.group.stroke=255,this.group.strokeWeight=2,this.group.overlaps(e)}fire(){if(1e3*world.physicsTime-this.lastFired>this.fireRate){const e=new this.group.Sprite;e.update=()=>{e.speed<3&&e.remove()},this.bulletsFired++,this.lastFired=1e3*world.physicsTime,this.group.amount>20&&this.group[0].remove()}}}class kbInput{constructor(e){Object.assign(this,e),this.up||="up",this.down||="down",this.left||="left",this.right||="right",this.slow||="shift"}isMoving(){return kb.pressing(this.up)||kb.pressing(this.down)||kb.pressing(this.left)||kb.pressing(this.right)}getMoveVel(e,t){let s=createVector(t,0);return kb.pressing(this.up)&&kb.pressing(this.right)?s.setHeading(-45):kb.pressing(this.up)&&kb.pressing(this.left)?s.setHeading(-135):kb.pressing(this.down)&&kb.pressing(this.right)?s.setHeading(45):kb.pressing(this.down)&&kb.pressing(this.left)?s.setHeading(135):kb.pressing(this.up)?s.setHeading(-90):kb.pressing(this.down)?s.setHeading(90):kb.pressing(this.right)?s.setHeading(0):kb.pressing(this.left)&&s.setHeading(180),kb.pressing(this.left)||kb.pressing(this.right)||(s.x=deltaLerp(e.x,0,.99999)),kb.pressing(this.up)||kb.pressing(this.down)||(s.y=deltaLerp(e.y,0,.99999)),kb.pressing(this.slow)&&s.setMag(s.mag()/2),s}}class Player extends Sprite{constructor(e){super([[0,0],[-50,50],[0,-70],[0,0]]),Object.assign(this,e),this.offset.x=-16.666,this.addCollider(-16.666,0,[[0,0],[50,50],[0,-70],[0,0]]),this.resetCenterOfMass(),this.rotationLock=!0,this.scale={x:.5,y:.5},this.pos={x:0,y:0},this.offset.y=-3.666,this.rotation=90,this.strokeWeight=.2,this.stroke=this.fill,this.autoFire=!1,this.targetSpeed||=6,this.subdetails||=new Group,this.arcindics=new this.subdetails.Group,this.arcindics.push(new ArcIndicator(this)),this.weapons||=[],this.projectiles||=new Group,this.activeWeapon=0,this.weapons.forEach((e=>{e.initialise(this)}))}directionalVelocity(e){if("number"!=typeof e)throw Error("Invalid or missing argument for directionalVelocity() function!");const t=e*Math.PI/180;return this.vel.x*Math.cos(t)+this.vel.y*Math.sin(t)}playerUpdate(){world.gravity.y&&(this.bearing=-90,this.applyForceScaled(world.gravity.y)),world.gravity.x&&(this.bearing=180,this.applyForceScaled(world.gravity.x)),this.projectiles.cull(10,10,10,10),this.vel=this.input.getMoveVel(this.vel,this.targetSpeed),kb.presses("e")&&(this.autoFire=!this.autoFire),kb.presses("q")&&(this.activeWeapon=(this.activeWeapon+1)%this.weapons.length),(kb.pressing("space")||this.autoFire)&&this.weapons[this.activeWeapon].fire(),kb.presses("q")&&this.game.funnysound.play(),kb.presses("m")&&(0===game.targetCameraSpeed?game.targetCameraSpeed=.1:game.targetCameraSpeed=0),kb.presses("b")&&(0===game.targetCameraSpeed?game.targetCameraSpeed=-.1:game.targetCameraSpeed=0)}runUpdate(){this.game.paused||this.playerUpdate()}tdebug(){this.debug?(this.debug=!1,this.strokeWeight=.2,this.stroke=this.fill):(this.debug=!0,this.strokeWeight=1)}}class Game{constructor(e){console.log("[NEW GAME]"),Object.assign(this,e),this.active=!0,this.cameraSpeed=0,this.targetCameraSpeed=0,this.cameraLerpAmount=.5,this.camPos={x:0,y:0},this.setPaused=!1,this.paused=!1,this.timeScale=1,this.hud=new GameHUD,this.objects=new Group,this.objects.stroke="white",this.objects.strokeWeight=2,this.players=new Group,this.playerDetails=new Group,this.projectiles=new Group,window.player||=new Player({game:this,projectiles:new this.projectiles.Group,subdetails:new this.playerDetails.Group,layer:1,fill:color(122,122,255),input:new kbInput,weapons:[new machineGun]}),this.players.push(player),this.walls=new this.objects.Group,this.walls.collides(this.projectiles,((e,t)=>t.remove())),this.wall=new this.walls.Sprite([[100,100],[200,-100]],"s"),this.wall2=new this.walls.Sprite([[-100,-100],[-100,100]],"s"),this.thingy=new this.objects.Sprite(50-canvas.hw,-150,30,30),this.thingy.vel.x=1,this.funnysound=new Howl({src:["./assets/quackmp3.mp3"],html5:!0,autoplay:!1}),camera.pos={x:0,y:0},this.players.autoDraw=!1,this.objects.autoDraw=!1,this.projectiles.autoDraw=!1;const t=calculateZoom(canvas.w,canvas.h,1500);camera.zoom=t;calculateBounds(canvas.w,canvas.h,t);this.boundsbox=new this.objects.Sprite(0,0,1500,canvas.h),this.boundsbox.overlaps(allSprites),this.boundsbox.layer=0,this.boundsbox.colour.setAlpha(1),this.startTimestamp=Date.now(),console.log("Game initialisation complete!")}draw(){if(kb.presses("p")&&(this.setPaused=!this.setPaused),this.setPaused||"visible"!==document.visibilityState?this.paused=!0:this.paused=!1,this.paused?world.timeScale=0:(world.timeScale=this.timeScale,this.camPos.x+=this.cameraSpeed*deltaTime,this.cameraSpeed!==this.targetCameraSpeed&&(this.cameraSpeed=deltaLerp(this.cameraSpeed,this.targetCameraSpeed,this.cameraLerpAmount))),camera.on(),this.projectiles.draw(),this.objects.draw(),this.playerDetails.draw(),this.players.draw(),camera.off(),this.hud.draw(),camera.on(),this.playerDetails.runUpdate(),this.players.runUpdate(),kb.presses("c"))throw Error("Congrats, you found the crash button!")}exit(){this.players.remove(),this.playerDetails.remove(),this.objects.remove(),this.projectiles.remove(),this.hud.remove(),this.draw=()=>{},this.active=!1}}

    window.GameManager = GameManager;
    window.GameHUD = GameHUD;
    window.ArcIndicator = ArcIndicator;
    window.machineGun = machineGun;
    window.kbInput = kbInput;
    window.Player = Player;
    window.Game = Game;
    window.windowResized = windowResized;
    window.calculateBounds = calculateBounds;
    window.calculateZoom = calculateZoom;
    

    window.manager = new GameManager();
  } catch(err) {
    console.error(err);
    document.getElementById("loadtext").innerHTML = "oops... something went wrong loading offline script. please check the console for more info!";
  }

  try {
    // setup canvas
    new Canvas(windowWidth - 50, windowHeight - 50);
    document.getElementById("canvasContainer").appendChild(canvas);
    document.getElementById("loadtext").innerHTML = "";

    // background colour
    manager.bgcol = color("#24283880");
    
    manager.opaquebgcol = color(red(manager.bgcol), green(manager.bgcol), blue(manager.bgcol));
    background(manager.opaquebgcol);

    // disable world auto step
    // world.autoStep = false;

    // annoying thing to make all sprites in a group run my update func
    Group.prototype.runUpdate = function() {
      this.forEach(s => s.runUpdate());
    }

    // initial setup complete - create game
    game = new Game();
    manager.setupDone = true;
    loop();
  } catch(error) {
    // setup error crash
    if(window.manager) {
      manager.crash({ type: "setupError", error });
    } else {
      document.getElementById("loadtext").innerHTML = "oops... an error occurred but the crash handler failed to run. check the console for more information!";
    }
  }
}

function draw() {
  if(!window.manager) {
    return console.log(`Waiting for manager to load...`);
  } else if(!manager.setupDone) {
    return console.log(`Skipping frame ${frameCount} as setup is incomplete.`);
  } else if(manager.crashed) {
    return console.warn(`Skipping frame ${frameCount} due to game crash.`);
  }

  if(document.hidden) {
    manager.lastHidden = performance.now();
  }
  background(manager.bgcol);
  // background(color("#242838"))

  // average deltatime, fps calcs
  manager.avgFPS = manager.fpsList.reduce((a, b) => a + b, 0)/manager.fpsList.length || frameRate();
  manager.avgDeltaTime = 1/manager.avgFPS;

  // set actual camera position to game's set position
  camera.pos = game.camPos;
  game.draw();
}
// after this the draw functions of sprites are called
// by default sprites are drawn in the order they were created in

function deltaLerp(a, b, f) { // hey look, it's the game's namesake!
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 25% the remaining distance every second
  return lerp(a, b, 1 - pow(1-f, deltaTime/1000));
}

const titlestyle = "font-size: 27px; color: lightblue; text-shadow: 2px 2px dodgerblue";
console.log(`%cdeltaLerp\n%cby dukemz - ${version}`, titlestyle, "color: cornflowerblue");