// main script
"use strict";
console.log("[HELLO WORLD]");
const version = "pre-alpha OFLV";

let scriptList = [
  'dlpofflineload.js'
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

async function injectOfflineCode(code) {
  const promises = []

  promises.push(new Promise((resolve, reject) => {
    const script = document.createElement('script');
      script.textContent = code;
      script.async = false; // ensure synchronous loading
      script.onload = resolve; // resolve the Promise when the script is loaded
      script.onerror = reject; // reject the Promise if the script fails to load
      document.body.appendChild(script);
  }));

  console.log("doing the thing")
  await Promise.all(promises);
  console.log("woag")
}

// function injectOfflineCode(code) { // load literal string data and append it to the html
//   return new Promise((resolve, reject) => {
//     try {
//       const script = document.createElement('script');
//       script.textContent = code;
//       script.type = 'text/javascript';
//       document.body.appendChild(script);
//       script.onload = () => resolve('Script loaded successfully');
//       script.onerror = (error) => reject(new Error('Script loading failed'));
//     } catch {
//       reject(new Error('Error appending script to the body'));
//     }
//   });
// }

// function appendScript(scriptContent) {
//   return new Promise((resolve, reject) => {
//       try {
//           // Create a new script element
//           const script = document.createElement('script');

//           // Set the script content
//           script.textContent = scriptContent;

//           // Set the script type to JavaScript
//           script.type = 'text/javascript';

//           // Resolve the promise when the script is loaded
//           script.onload = () => resolve('Script loaded successfully');

//           // Reject the promise if there's an error loading the script
//           script.onerror = (error) => reject(new Error('Script loading failed'));

//           // Append the script to the body
//           console.log("WE ARE HERE")
//           document.body.appendChild(script);
//           console.log("NOW WE ARE HERE")

//       } catch (error) {
//           // Reject the promise if there's an error appending the script
//           reject(new Error('Error appending script to the body'));
//       }
//   });
// }

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
    await loadScripts(scriptList);
    const dataCode = `console.log("what the heck dude")`;
    const test = await injectOfflineCode(dataCode);
    console.log(test)
    
    console.log("Offline script data loaded and injected!");
    
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