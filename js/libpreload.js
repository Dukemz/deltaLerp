"use strict";

const q5scripts = [
  "core",
  "color",
  "canvas",
  "display",
  "vector",
  "util",
  "c2d-canvas",
  "c2d-drawing",
  "c2d-text"
];

(async () => {
  try {
    console.log("[LIBPRELOAD] Loading q5 modules...");
    await loadScripts(q5scripts.map(x => `lib/q5/q5-${x}.js`));

    console.log("[LIBPRELOAD] Initialising q5...");
    new Q5("auto");

    // console.log("[LIBPRELOAD] Loading game manager...");
    // await loadScripts(['js/gamemanager.js', 'js/audiomgr.js']);
    // window.manager = new GameManager({ libpreload: true });

    console.log("[LIBPRELOAD] Loading planck/p5play...");
    await loadScripts(["lib/planck.min.js", "lib/p5play.js"]);

    // console.log("[LIBPRELOAD] Running p5play init...");
    // Q5.methods.init.find(x => x.name === "p5playInit")();

    console.log("[LIBPRELOAD] done lol");

  } catch {
    document.getElementById("loadtext").innerHTML = "oops... something went wrong during preload.<br>check the console for more info!";
    console.warn("[LIBPRELOAD] Error during preload! Displayed below:");
    console.error(error);

    for(let c of document.getElementsByTagName("canvas")) {
      c.style.display = "none"; // hide any canvases if they were created
    }
  }
})();