// main script
"use strict";
console.log("[HELLO WORLD]");
const version = "pre-alpha";

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
  'js/basicsplitter.js',
  'js/homingtriangle.js'
];


// menu/game instance
let menu, game;

async function loadScripts(scriptUrls) { // load scripts and add them to the page
  // may be able to reuse this function for level loading and/or modding
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

      // on script load, resolve the promise and remove the script from the DOM
      // this can be done since scripts stay in memory once loaded
      script.onload = () => {
        resolve();
        scriptContainer.removeChild(script); // remove the script tag
      };

      // on error, reject the promise
      script.onerror = reject;

      // append the script to the container
      scriptContainer.appendChild(script);
    }));
  }

  // wait for all Promises to resolve
  await Promise.all(promises);
}


function preload() {
  // this function doesn't do much, but it's called before setup
  // console log helps with debugging 
  noLoop();

  const testimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAdCAIAAABE/PnQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG1SURBVEhLzZY/UoNAFMZZx8bO1rEylXcQKi8BHkHkBHEmOGNS2UU8gnAJKziApZUewxK/t99mk3GAhQQcf0M2uw/yvvdnl4kKw9CbjKIoRCCOY2MYlSzLtgL3yxNjHo+z0ycIHJvVvjzOvzEGQVCW5a8Ji3+Ez6QcKoBIQeOETN5k0wMsOBmLbdDIAG3BWI8KfcL/P2tytMGsezBAAH5zDeqrlDJWF+6Dpm4eMIb1B8aqqux2gF6hLmGHJC2NODKA9/p1sV4urlbixfd9uz3gHbdg787GVaI8hcbdhYeL2Azg/fnLS+aSXwetAvArxYlSLm1jbQa0lLfXGDuS6MoAMXJEpBabAUqEtN7Pfez69WfdptHeZBRHf7MN3ipPZgpHX9sExC4lmqlkk2UjPbZpLr9HsIwUFyeI3dkAoe1VwYMO6FRmiDRK5XXPkKMUj/HtD/gri/tVgd2N5+gLdTBO9U5FTpRE9YKXN0zkyRZ6lMiiayVbi5J66cQhgE6KLz2RMBH7Um8tjWjkUij9bDMOARSEvqQyGuoR3jKLFoaUaKeTZt2DYQJ78Cd/vIxhAnZP/jR43g8mcFyLHdrIDAAAAABJRU5ErkJggg==";
  window.oogle = loadImage(testimg);

  console.log("[SETUP] Preload complete.");
}

async function setup() {
  console.log("[SETUP] Initialising...");
  document.getElementById("loadtext").innerHTML = "loading scripts...";

  // there's gonna be a lot of nested try/catches here unfortunately
  try { // load manager first
    await loadScripts(['js/gamemanager.js', 'js/audiomgr.js']);
    window.manager = new GameManager();

    try { // setup canvas
      console.log(`[SETUP] Creating canvas - w: ${windowWidth - 50}px, h: ${windowHeight - 50}px`);
      new Canvas(windowWidth - 50, windowHeight - 50);
      document.getElementById("canvasContainer").appendChild(canvas);
      document.getElementById("loadtext").innerHTML = "";

      // window resize listener for q5 workaround
      if(window.Q5) addEventListener("resize", () => {
        if(window.manager.crashed) windowResized();
      });

      // disable world auto step
      world.autoStep = false;
      // set font (note: this gets messed up if p5play.renderStats is set to true)
      textFont("Trebuchet MS");

      try { // load game scripts
        await loadScripts(scriptList);
        console.log("[SETUP] All game scripts loaded!");

        // annoying thing to make all sprites in a group run my update func
        Group.prototype.runUpdate = function () {
          for(let s of this) {
            if(s.runUpdate) s.runUpdate();
          }
        }
        // load menu audio
        // note: to avoid lag, audio assets should be loaded outside of game or menu in an async func with await
        // await loadScripts(["assets/stargazer.dzdla"]);

        // initial setup complete - create menu
        menu = new Menu();
        await menu.init();

        console.log("[SETUP] Setup complete!");
        manager.setupDone = true;
        loop();
        
      } catch(error) {
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
  }
}

function draw() {
  if(!window.manager) {
    return console.log(`[DRAW] Skipping frame ${frameCount}, manager is not loaded yet.`);
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
      // average deltatime, fps calcs
      manager.avgFPS = manager.fpsList.reduce((a, b) => a + b, 0) / manager.fpsList.length || frameRate();
      manager.avgDeltaTime = 1 / manager.avgFPS;
      if(manager.avgFPS < 2) console.warn(`Warning: Average FPS is ${manager.avgFPS.toFixed(3)}!`);

      if(window.Q5) {
        manager.q5avgFPS = manager.q5fpsList.reduce((a, b) => a + b, 0) / manager.q5fpsList.length || getFPS();
      }
    }

    if(manager.ingame) {
      game.draw();
    } else if(menu?.active) {
      menu.draw();
    }

    // step world
    world.calcTimeStep = (1 / (frameRate() || 60)) * world.timeScale;
    if(world.timeScale) world.step(
      world.calcTimeStep,
      world.velocityIterations,
      world.positionIterations
    );
  } catch(error) {
    manager.crash({ type: "drawError", error });
  }
}
// after this the draw functions of sprites are called
// by default sprites are drawn in the order they were created in

function windowResized() {
  const oldWidth = canvas.w;
  const oldHeight = canvas.h;
  const oldZoom = camera.zoom;
  // resize canvas to fit the new window size
  canvas.resize(windowWidth - 50, windowHeight - 50);

  if(manager.crashed) {
    console.log("[WINDOW] Resized - redrawing crash handler data.");
    manager.crashdraw();
  } else if(game) { // run game window resize func
    console.log(`[WINDOW] Resized: [${oldWidth}, ${oldHeight}] => [${canvas.w}, ${canvas.h}]`);
    game.windowResized(oldWidth, oldHeight, oldZoom);
  }
}

function deltaLerp(a, b, f, ignoreTimeScale) { // hey look, it's the game's namesake!
  let tsc = world.timeScale;
  if(ignoreTimeScale) tsc = 1;
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 25% the remaining distance every second
  return lerp(a, b, (1 - pow(1 - f, deltaTime / 1000)) * tsc);
}

const titlestyle = "font-size: 27px; color: lightblue; text-shadow: 2px 2px dodgerblue";
console.log(`%cdeltaLerp\n%cby dukemz - ${version}`, titlestyle, "color: cornflowerblue");