// main script
"use strict";
console.log("[HELLO WORLD]");
const version = "pre-alpha";

let fpsList = [], fpsPush, avgFPS, avgDeltaTime;
let scriptList = [
  'js/player.js',
  'js/windowResized.js',
  'js/machinegun.js',
  'js/arcindicator.js',
  'js/game.js',
  'js/gamehud.js',
  'js/kbinput.js'
];

// will hold game instance
let game;

async function loadScripts(scriptUrls) { // load scripts and add them to the page
  // may be able to reuse this function for level loading and/or modding
  // maybe modded scripts can be packaged and loaded on the main menu?

  // create an array to store Promise objects
  const promises = [];
  // dynamically load each script
  scriptUrls.forEach(scriptUrl => {
    promises.push(new Promise((resolve, reject) => {
      // create script element and set its source
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = false; // ensure synchronous loading
      script.onload = resolve; // resolve the Promise when the script is loaded
      script.onerror = reject; // reject the Promise if the script fails to load
      document.body.appendChild(script);
    }));
  });

  // wait for all Promises to resolve
  await Promise.all(promises);
}

function preload() {
  // this function doesn't do much, but it's called before setup
  // console log helps with debugging 
  console.log("[PRELOAD]");
  noLoop();

  const testimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAdCAIAAABE/PnQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG1SURBVEhLzZY/UoNAFMZZx8bO1rEylXcQKi8BHkHkBHEmOGNS2UU8gnAJKziApZUewxK/t99mk3GAhQQcf0M2uw/yvvdnl4kKw9CbjKIoRCCOY2MYlSzLtgL3yxNjHo+z0ycIHJvVvjzOvzEGQVCW5a8Ji3+Ez6QcKoBIQeOETN5k0wMsOBmLbdDIAG3BWI8KfcL/P2tytMGsezBAAH5zDeqrlDJWF+6Dpm4eMIb1B8aqqux2gF6hLmGHJC2NODKA9/p1sV4urlbixfd9uz3gHbdg787GVaI8hcbdhYeL2Azg/fnLS+aSXwetAvArxYlSLm1jbQa0lLfXGDuS6MoAMXJEpBabAUqEtN7Pfez69WfdptHeZBRHf7MN3ipPZgpHX9sExC4lmqlkk2UjPbZpLr9HsIwUFyeI3dkAoe1VwYMO6FRmiDRK5XXPkKMUj/HtD/gri/tVgd2N5+gLdTBO9U5FTpRE9YKXN0zkyRZ6lMiiayVbi5J66cQhgE6KLz2RMBH7Um8tjWjkUij9bDMOARSEvqQyGuoR3jKLFoaUaKeTZt2DYQJ78Cd/vIxhAnZP/jR43g8mcFyLHdrIDAAAAABJRU5ErkJggg==";
  window.oogle = loadImage(testimg);
}

async function setup() {
  console.log("[SETUP]");
  document.getElementById("loadtext").innerHTML = "loading scripts...";
  await loadScripts(scriptList);
  console.log("All scripts loaded!");

  new Canvas(windowWidth - 50, windowHeight - 50);
  document.getElementById("canvasContainer").appendChild(canvas);
  document.getElementById("loadtext").innerHTML = "";

  // get the current fps 10 times a second
  // used to get average FPS over the last 3 seconds
  fpsPush = setInterval(() => {
    fpsList.push(frameRate());
    if (fpsList.length > 30) fpsList.shift();
  }, 100);

  // background colour
  window.bgcol = color("#24283880");
  
  const opaquebgcol = color(red(bgcol), green(bgcol), blue(bgcol));
  background(opaquebgcol);

  // disable world auto step
  // world.autoStep = false;

  // annoying thing to make all sprites in a group run my update func
  Group.prototype.runUpdate = function() {
    this.forEach(s => s.runUpdate());
  }

  // initial setup complete - create game
  try {
    game = new Game();
    window.setupDone = true;
    loop();
  } catch(err) {
    console.error(`%coh no\n%cGame setup failed to complete.\n${err.name}: ${err.message}`, "font-size: 27px", "");
    console.error(err.stack);
    noLoop();

    push();
    background(0, 0, 0, 200);
    noStroke();
    fill(255, 90, 100);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textWrap(WORD);
    textSize(20);

    const maxtextwidth = canvas.w - 20;
    text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
    textStyle(NORMAL);
    let errmsg = `Game setup failed to complete.\n${err.name}: ${err.message}\n`;
    if(err.fileName) {
      errmsg += `\nSource: ${err.fileName}\nLine ${err.lineNumber}, col ${err.columnNumber}\n`;
    } else {
      errmsg += `\nMore information can be provided when running the game in Firefox.\n`;
    }
    errmsg += `\nPlease check the console for more details.`;
    text(errmsg, 10, 40, maxtextwidth);

    pop();
  }
}

function draw() {
  if(!window.setupDone) {
    console.log(`Setup incomplete - skipping frame ${frameCount}`);
    return;
  }

  if(document.hidden) {
    window.lastHidden = performance.now();
  }
  background(window.bgcol);
  // background(color("#242838"))

  // average deltatime, fps calcs
  avgFPS = fpsList.reduce((a, b) => a + b, 0)/fpsList.length || frameRate();
  avgDeltaTime = 1/avgFPS;

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


// Error handling
window.onerror = (event, source, lineno, colno, error) => {
  // according to mdzn, event should be human readable message explaining the problem
  console.error(`%coh no\n%c${event}\nSource = ${source}\nLine ${lineno}, col ${colno}`, "font-size: 27px", "");
  if(error) {
    console.error(`Stack trace:\n${error.stack}`);
  }
  noLoop();

  push();
  background(0, 0, 0, 200);
  noStroke();
  fill(255, 90, 100);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textWrap(WORD);
  textSize(20);

  const maxtextwidth = canvas.w - 20;
  text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
  textStyle(NORMAL);
  let errmsg = `${event}\nSource: ${source}\n`;
  if(error) {
    errmsg += `Line ${lineno}, col ${colno}\n`;
  }
  errmsg += `\nPlease check the console for more details.`;
  text(errmsg, 10, 40, maxtextwidth);

  pop();
};

// unhandled promise rejection
addEventListener("unhandledrejection", (event) => {
  console.error(`%coh no\n%cUnhandled promise rejection: ${event.reason}`, "font-size: 27px", "");
  noLoop();

  push();
  background(0, 0, 0, 200);
  noStroke();
  fill(255, 90, 100);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textWrap(WORD);
  textSize(20);

  const maxtextwidth = canvas.w - 20;
  text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
  textStyle(NORMAL);
  let errmsg = `Unhandled promise rejection: ${event.reason}\negg\n`;
  errmsg += `\nPlease check the console for more details.`;
  text(errmsg, 10, 40, maxtextwidth);

  pop();
});

const titlestyle = "font-size: 27px; color: lightblue; text-shadow: 2px 2px dodgerblue";
console.log(`%cdeltaLerp\n%cby dukemz - ${version}`, titlestyle, "color: cornflowerblue");