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
        await loadScripts(["assets/stargazer.dzdla"]);

        // initial setup complete - create menu
        menu = new Menu();
        // game = new Game();

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




async function oldsetup() {
  console.log("[SETUP] Initialising...");
  document.getElementById("loadtext").innerHTML = "loading scripts...";
  try { // load manager first
    await loadScripts(['js/gamemanager.js', 'js/audiomgr.js']);
    window.manager = new GameManager();

    await loadScripts(scriptList);
    console.log("[SETUP] All game scripts loaded!");

    try {
      // setup canvas
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

      // set the font
      textFont("Trebuchet MS");

      if(manager.crashed) {
        manager.crashdraw();
        return console.warn("[SETUP] Cancelling setup due to crash!");
      }

      // annoying thing to make all sprites in a group run my update func
      Group.prototype.runUpdate = function () {
        for(let s of this) {
          if(s.runUpdate) s.runUpdate();
        }
      }

      // load menu audio
      // note: to avoid lag, audio assets should be loaded outside of game or menu in an async func with await
      await loadScripts(["assets/stargazer.dzdla"]);

      // initial setup complete - create menu
      menu = new Menu();
      // game = new Game();

      manager.setupDone = true;
      loop();
    } catch(error) {
      // setup error crash
      if(window.manager) {
        manager.crash({ type: "setupError", error });
      } else { // note to self: if this happens, hide the canvas
        // document.getElementsByTagName("canvas").forEach(c => c.style.display = "none");
        for(let c of document.getElementsByTagName("canvas")) {
          c.style.display = "none";
        }
        document.getElementById("loadtext").innerHTML = "oops... an error occurred but the crash handler failed to run. check the console for more information!";
        console.error(error);
      }
    }


  } catch(error) {
    console.warn("[SETUP] Error loading scripts! Displayed below:");
    console.error(error);
    document.getElementById("loadtext").innerHTML = "oops... something went wrong loading one of the scripts. please check the console for more info!";
  }

  // end setup code
}