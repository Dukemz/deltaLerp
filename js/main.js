// main script
"use strict";
console.log("[HELLO WORLD]");
const version = "pre-alpha";

// list of all game scripts to load
let scriptList = [
  'js/lerpcontroller.js',
  'js/gamehud.js',
  'js/arcindicator.js',
  'js/kbinput.js',
  'js/controllerinput.js',
  'js/player.js',
  'js/game.js',
  'js/menu.js',
  'js/enemy.js',

  'js/machinegun.js',
  'js/shotgun.js',
  'js/basicsplitter.js',
  'js/homingtriangle.js'
];

// menu/game instances
let menu, game;

async function loadScripts(scriptUrls) { // load scripts and add them to the page
  // may be able to reuse this function for level loading and/or modding

  if(!Array.isArray(scriptUrls)) throw TypeError("loadScripts must be provided an array of URL strings.");

  const scriptContainer = document.getElementById("loadedScripts");

  // create an array to store Promise objects
  const promises = [];

  // dynamically load each script
  for(let scriptUrl of scriptUrls) {
    promises.push(new Promise((resolve, reject) => {
      // create script element and set its source
      const script = document.createElement('script');
      // note: github pages probably serves non *.js files as application/octet-stream
      // this logs a warning in the console but hopefully doesn't do anything else
      script.type = "text/javascript";
      script.src = scriptUrl;
      script.async = false; // ensure synchronous loading
      // script.defer = true; // defer - https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/defer

      // on error, reject the promise
      // script.onerror = reject;
      script.onerror = () => {
        reject(Error(`Failed to load [${scriptUrl}] - URL is likely invalid.`));
      }

      // on script load, resolve the promise and remove the script from the DOM
      // this can be done since scripts stay in memory once loaded
      script.onload = () => {
        // crash detection
        if(window.manager && window.manager.crashed) {
          reject(Error(`An error occurred loading [${scriptUrl}] - script loading halted.`));
        } else {
          resolve();
          scriptContainer.removeChild(script); // remove the script tag
        }
      };

      // append the script to the container
      scriptContainer.appendChild(script);
    }));
  }

  // wait for all Promises to resolve
  await Promise.all(promises);
}


function preload() {
  // this function doesn't do much, but it's called before setup
  // the console.log at the end helps with debugging 

  noLoop();
  console.log("[SETUP] Preload complete.");
}

async function setup() {
  console.log("[SETUP] Initialising...");
  document.getElementById("loadtext").innerHTML = "loading scripts...";

  // there's gonna be a lot of nested try/catches here, unfortunately this is necessary
  try { // load manager first
    await loadScripts(['js/gamemanager.js', 'js/audiomgr.js']);
    window.manager = new GameManager();

    try { // setup canvas
      console.log(`[SETUP] Creating canvas - w: ${windowWidth - 50}px, h: ${windowHeight - 50}px`);
      new Canvas(windowWidth - 50, windowHeight - 50);
      // add canvas to the page and hide the load text
      document.getElementById("canvasContainer").appendChild(canvas);
      document.getElementById("loadtext").innerHTML = "";

      // if using q5.js instead of p5.js, windowResized() doesn't trigger if game has crashed
      // so this creates a listener to trigger it manually
      if(window.Q5) addEventListener("resize", () => {
        if(window.manager.crashed) windowResized();
      });

      // disable world auto step
      world.autoStep = false;
      // make group.remove() actually remove groups
      p5play.storeRemovedGroupRefs = false
      // set font for entire sketch (note: this breaks if p5play.renderStats is set to true)
      textFont("Trebuchet MS");

      try { // load game scripts
        await loadScripts(scriptList);
        console.log("[SETUP] All game scripts loaded!");

        // make all sprites in a group run my custom update function
        Group.prototype.runUpdate = function () {
          for(let s of this) {
            if(s.runUpdate) s.runUpdate();
          }
        }
        // note: to avoid lag, audio assets should be loaded outside of game or menu in an async func with await

        // add visibility change event
        addEventListener('visibilitychange', () => {
          if(manager.ingame) {
            game.visibilitychange();
          } else if(menu.active) {
            menu.visibilitychange();
          }
        });

        // initial setup complete - create menu
        menu = new Menu();
        await menu.init();

        console.log("[SETUP] Setup complete!");
        manager.setupDone = true;
        loop(); // start the draw loop
        
      } catch(error) { // if an error occurs outside of here the game manager is probably not available
        // but here the game manager should be loaded so crash can be handled with it
        manager.crash({ type: "setupError", error });
      }

    } catch(error) { // failed to create canvas?
      document.getElementById("loadtext").innerHTML = "oops... something went wrong during the setup process.<br>check the console for more info!";
      console.warn("[SETUP] Error during setup! (Canvas-related?) Displayed below:");
      console.error(error);

      // hide canvases (if there are any)
      for(let c of document.getElementsByTagName("canvas")) {
        c.style.display = "none";
      }
    }

  } catch(error) { // failed to load manager
    document.getElementById("loadtext").innerHTML = "oops... something went wrong loading the game manager.<br>check the console for more info!";
    console.warn("[SETUP] Error creating game manager instance! Displayed below:");
    console.error(error);

    for(let c of document.getElementsByTagName("canvas")) {
      c.style.display = "none";
    }
  }
}

function draw() {
  if(!window.manager) {
    return console.log(`[DRAW] Skipping frame ${frameCount}, manager is not loaded yet.`);
    // the following 2 conditions are for robustness and shouldn't occur normally
  } else if(!manager.setupDone) {
    noLoop();
    return console.warn(`[DRAW] Skipping frame ${frameCount} and stopping draw loop as setup is incomplete.`);
  } else if(manager.crashed) {
    noLoop();
    return console.warn(`[DRAW] Skipping frame ${frameCount} and stopping draw loop due to game crash.`);
  }

  try {
    if(document.hidden) {
      manager.lastHidden = performance.now();
    } else {
      manager.calculatePerformance();
    }

    if(manager.ingame) {
      game.draw();
    } else if(menu?.active) {
      menu.draw();
    }

    // world step, progress physics simulation
    world.calcTimeStep = (1 / (frameRate() || 60)) * world.timeScale;
    if(world.timeScale) world.step(
      world.calcTimeStep,
      world.velocityIterations,
      world.positionIterations
    );

    // debug - restart game
    if(manager.ingame && kb.presses("l")) {
      game.exit();
      game = new Game();
    }
  } catch(error) {
    manager.crash({ type: "drawError", error });
  }
}
// after this the draw functions of sprites with autoDraw enabled are called
// by default sprites are drawn in the order they were created in

function windowResized() {
  const oldWidth = canvas.w;
  const oldHeight = canvas.h;
  const oldZoom = camera.zoom;

  const newWidth = windowWidth - 50;
  const newHeight = windowHeight - 50;
  // sometimes this function gets called even when the window isn't actually resized
  if(newWidth === oldWidth && newHeight === oldHeight) return;

  // resize canvas to fit the new window size
  canvas.resize(newWidth, newHeight);

  if(manager.crashed) {
    console.log("[WINDOW] Resized - redrawing crash handler data.");
    manager.crashdraw();
  } else if(menu.active) {
    console.log(`[WINDOW/MENU] Resized: [${oldWidth}, ${oldHeight}] => [${canvas.w}, ${canvas.h}]`);
    menu.windowResized(oldWidth, oldHeight, oldZoom);
  } else if(game.active) { // run game window resize func
    console.log(`[WINDOW/GAME] Resized: [${oldWidth}, ${oldHeight}] => [${canvas.w}, ${canvas.h}]`);
    game.windowResized(oldWidth, oldHeight, oldZoom);
  }
}

// HERE BE FUNCTIONS //

// hey look, it's the game's namesake!
/**
 * Lerp with deltaTime.
 *
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @param {number} f - Factor to interpolate by. Must be between 0 and 1.
 * @param {boolean} ignoreTimeScale - Whether to ignore world.timeScale
 * @returns {number}
 */
function deltaLerp(a, b, f, ignoreTimeScale) {
  let tsc = world.timeScale;
  if(ignoreTimeScale) tsc = 1;
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 25% the remaining distance every second
  return lerp(a, b, (1 - pow(1 - f, deltaTime / 1000)) * tsc);
}


/**
 * Generate the points of an equilateral triangle given a side length.
 *
 * @param {number} sideLength
 * @returns {number[]}
 */
function generateTrianglePoints(sideLength) {
  // calculate the height of an equilateral triangle using the formula: height = (sqrt(3) / 2) * sideLength
  const tHeight = (Math.sqrt(3) / 2) * sideLength;

  // define the three points of the triangle
  const pointA = { x: 0, y: -2*tHeight/3 };
  const pointB = { x: -sideLength / 2, y: tHeight / 3 };
  const pointC = { x: sideLength / 2, y: tHeight / 3 };

  return [pointA, pointB, pointC];
}

/**
 * Simple async sleep function.
 * @param {Number} ms - Milliseconds to wait for
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// despite this code being at the end of the file it gets run first
// it's just here to check the rest of the code in the file got parsed properly
const titlestyle = "font-size: 27px; color: lightblue; text-shadow: 2px 2px dodgerblue";
console.log(`%cdeltaLerp\n%cby dukemz - ${version}`, titlestyle, "color: cornflowerblue");