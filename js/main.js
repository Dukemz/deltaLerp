"use strict";
console.log("[HELLO WORLD]");

let originalW, originalH;
let fpsList = [], fpsPush, avgFPS, avgDeltaTime;
let scriptList = [
  'draw',
  'player',
  'windowResized'
];

let player;

async function loadScripts(scriptUrls) {
  // Create an array to store Promise objects
  const promises = [];

  // Dynamically load each script
  scriptUrls.forEach(scriptUrl => {
    promises.push(
      new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `js/${scriptUrl}.js`;
        script.async = false; // Ensure synchronous loading
        script.onload = resolve; // Resolve the Promise when the script is loaded
        script.onerror = reject; // Reject the Promise if the script fails to load
        document.body.appendChild(script);
      })
    );
  });

  // Wait for all Promises to resolve
  await Promise.all(promises);
}

function preload() { // preload assets (if any)
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

  // original height and width
  // world origin will be ow/2, oh/2
  originalW = canvas.w;
  originalH = canvas.h;

  // setup player
  player = new Player(10, 10, 50, 50);

  // test sprite

}

function deltaLerp(a, b, f) { // lerp with deltatime
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 75% the remaining distance every second
  return lerp(a, b, 1 - pow(f, avgDeltaTime));
}