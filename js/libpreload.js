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
  console.log("[LIBPRELOAD] Loading q5 modules...");
  loadScripts(q5scripts.map(x => `lib/q5/q5-${x}.js`));

  console.log("[LIBPRELOAD] Loading planck/p5play...");
  await loadScripts(["lib/planck.min.js", "lib/p5play.min.js"]);

  console.log("[LIBPRELOAD] All libraries ready, initialising q5!");
  new Q5("auto");
})();