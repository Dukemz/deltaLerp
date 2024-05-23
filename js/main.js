// main script
"use strict";
console.log("[HELLO WORLD]");

let originalW, originalH, startTimestamp;
let fpsList = [], fpsPush, avgFPS, avgDeltaTime;
let scriptList = [
  'draw',
  'player',
  'windowResized',
  'machinegun',
  'arcindicator'
];

let player;

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

function preload() { // preload assets (none at the moment though)
  document.getElementById("loadtext").innerHTML = "loading assets...";
  console.log("[PRELOAD]");
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

  // setup player
  player = new Player({
    layer: 1,
    stroke: color(122, 122, 255),
    weapons: [
      new machineGun()
    ]
  });

  // various objects
  randomObjs = new Group();
  randomObjs.height = 50;
  randomObjs.width = 50;
  randomObjs.drag = 1;
  randomObjs.rotationDrag = 1;
  // assume center is 0, 0
  randomObjs.x = () => random(-canvas.hw, canvas.hw);
  randomObjs.y = () => random(-canvas.hh, canvas.hh);

  rocks = new randomObjs.Group();
  rocks.image = () => random(["🗿", "💀"]);
  rocks.collides(player.projectiles, (_p, b) => b.remove())
  rocks.amount = 5;

  stars = new randomObjs.Group();
  stars.image = "✨";
  stars.overlaps(player.projectiles, (_p, b) => b.remove());
  stars.amount = 5;

  // just move the camera to center, why not?
  camera.pos = {x: 0, y: 0};
  background("#242838");

  // save timestamp on when the thing starts
  // at some point game will be a class, so setup opens the menu rather than jumping straight into the game
  startTimestamp = Date.now();
}
// test variables below
let randomObjs, rocks, stars;

function deltaLerp(a, b, f) { // lerp with deltatime
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 75% the remaining distance every second
  return lerp(a, b, 1 - pow(f, avgDeltaTime));
}