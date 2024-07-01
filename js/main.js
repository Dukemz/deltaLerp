// main script
"use strict";
console.log("[HELLO WORLD]");

let fpsList = [], fpsPush, avgFPS, avgDeltaTime;
let scriptList = [
  'player',
  'windowResized',
  'machinegun',
  'arcindicator',
  'game',
  'gamehud',
  'kbinput'
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
      script.src = `js/${scriptUrl}.js`;
      script.async = false; // ensure synchronous loading
      script.onload = resolve; // resolve the Promise when the script is loaded
      script.onerror = reject; // reject the Promise if the script fails to load
      document.body.appendChild(script);
    }));
  });

  // wait for all Promises to resolve
  await Promise.all(promises);
}

function preload() { // preload assets
  console.log("[PRELOAD]");
  document.getElementById("loadtext").innerHTML = "loading assets...";
  // don't actually have any assets to load yet lol
  // but music will be loaded here
}

async function setup() {
  console.log("[SETUP]");
  document.getElementById("loadtext").innerHTML = "loading scripts...";
  await loadScripts(scriptList);
  console.log("All scripts loaded!");

  new Canvas(windowWidth - 100, windowHeight - 100);
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
  game = new Game();
}

function draw() {
  if(document.hidden) {
    window.lastHidden = performance.now();
  }
  background(window.bgcol);
  // background(color("#242838"))

  // average deltatime, fps calcs
  avgFPS = fpsList.reduce((a, b) => a + b, 0)/fpsList.length || frameRate();
  avgDeltaTime = 1/avgFPS;

  game.draw();
}
// after this the draw functions of sprites are called
// by default sprites are drawn in the order they were created in
// each sprite's update function is called after it is drawn

function deltaLerp(a, b, f) { // lerp with deltatime
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 25% the remaining distance every second
  return lerp(a, b, 1 - pow(1-f, deltaTime/1000));
}