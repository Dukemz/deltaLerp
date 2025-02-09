// main script
"use strict";
console.log("[HELLO WORLD]");
const version = "pre-alpha";

// list of all game scripts, excluding manager/preload
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

// first load game manager
try {
  // library preload
  if(!window.p5) {
    console.log("[MAIN] p5/q5 not in memory, opening libpreload.js.");
    loadScripts(["js/libpreload.js"]);
  }

} catch(error) {
  document.getElementById("loadtext").innerHTML = "oops... something went wrong during preload.<br>check the console for more info!";
  console.warn("[SETUP] Error with libpreload! Displayed below:");
  console.error(error);

  // COPY THIS INTO ANY ERRORS THAT OCCUR DURING P5/Q5 SETUP!
  // for(let c of document.getElementsByTagName("canvas")) {
  //   c.style.display = "none";
  // }
}

function preload() {
  // this function doesn't actually do anything - it's called by p5/q5 before setup
  // the console.log just helps with debugging

  noLoop();
  console.log("[SETUP] p5/q5 ready.");
}

async function setup() {
  // console.log("[SETUP] Initialising...");
  document.getElementById("loadtext").innerHTML = "loading...";

  if(!window.manager) { // manager doesn't exist, create it
    console.log("[SETUP] Initialising...");
    // manager needs to load here
    // but p5play may not be loaded
  } else {
    console.log("[SETUP] manager already exists, activate panic attack");
  }
}


// HERE BE FUNCTIONS //

/**
 * Load and execute a list of script files.
 *
 * @async
 * @param {Array.<String>} scriptUrls - Array of script URLs to load
 * @returns {*} 
 */
async function loadScripts(scriptUrls) {
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

// hey look, it's the game's namesake!
/**
 * Lerp with deltaTime.
 *
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @param {number} f - Factor to interpolate by. Must be between 0 and 1.
 * @param {boolean} ignoreTimeScale - Whether to ignore world.timeScale.
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
  const pointA = { x: 0, y: -2 * tHeight / 3 };
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