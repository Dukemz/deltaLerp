"use strict";
console.log("what the branch");

let fpsList = [];
let fpsPush, avgFPS, avgDeltaTime;

let branchStructure;

function setup() {
  new Canvas(windowWidth - 100, windowHeight - 100);
  document.getElementById("canvasContainer").appendChild(canvas);
  document.getElementById("loadtext").innerHTML = "";

  // get the current fps 10 times a second
  fpsPush = setInterval(() => {
    fpsList.push(frameRate());
    if(fpsList.length > 30) fpsList.shift();
  }, 100);

  camera.pos = { x: 0, y: 0 };
  camera.zoom = 0;
  window.targetZoom = 1;
  window.zoomSpeed = 0.1;

  stroke(255);
  strokeWeight(2);

  window.things = new Group();
  things.drag = 5;
  things.rotationLock = true;
  things.textSize = 15;

  // automatic branch creation system
  // group as 1st argument, structure data as 2nd (optional base sprite as 3rd)
  branchMake(things, branchStructure);
  window.activeSpr = things[0];

  background(color("#242838"));
}

function draw() {
  background(color("#24283890"));

  // temp
  things[0].text = things[3].distanceTo(things[1]).toFixed(3)

  // average deltatime, fps calcs
  avgFPS = fpsList.reduce((a, b) => a + b, 0)/fpsList.length || 0;
  avgDeltaTime = 1/avgFPS;

  camera.zoom = lerp(camera.zoom, targetZoom, zoomSpeed);

  things.forEach(thing => {
    if(thing.mouse.hovering()) window.activeSpr = thing;
    // list not including this
    const thingsExceptThisThing = things.filter(x => x.idNum !== thing.idNum)
    thingsExceptThisThing.forEach(t => {
      // why am i doing this lol
      const gravconst = 300;
      const distance = thing.distanceTo(t);
      let force = ((gravconst * thing.mass * t.mass) / distance);
      
      // anti stuck logic
      thing.stuckWith ||= [];
      if(!thing.stuckWith.includes(t)) { // are we stuck with this sprite?
        // if not stuck, check how long we've been touching it
        const secsColliding = thing.colliding(t)/avgFPS;
        if(secsColliding >= 0.5) { // if been touching for half a second or more...
          // add to the stuck list
          thing.stuckWith.push(t);
          t.stuckWith.push(thing);
          // phase through (overlap) it
          thing.overlaps(t);
        }
      } else { // we are stuck with this sprite
        if(thing.distanceTo(t) > 75) { // if far away enough...
          // then re-enable collision
          thing.collides(t);
          // remove 1 item from list at index
          const index = thing.stuckWith.indexOf(t);
          thing.stuckWith.splice(index, 1);
        }
      }
      if(thing.stuckWith.length > 0) { // colour outline
        thing.strokeColor = "red";
      } else {
        thing.strokeColor = "white";
      }
      // thing.text = (force).toFixed(3);
      thing.repelFrom(t, force);
    });
  });

  // activeSpr.moveTowards(mouse, 1);
  activeSpr.moveTowards(0, 0);

  // if(frameCount % 60 === 0) activeSpr = random(things);

  // activeSpr.scale.x = 2
  // activeSpr.scale.y = 2
}

function branchMake(maingroup, data, basespr) {
  // this func will be run recursively
  // branchmake will be called again for each of the sub branches once a complete set is made
  let spr;

  if(basespr instanceof Sprite) { // create a sprite below the provided base sprite
    spr = new maingroup.Sprite(basespr.x, basespr.y + 100);
    // join them with a distance joint
    new DistanceJoint(basespr, spr);    
  } else { // no base sprite data provided, make one
    spr = new maingroup.Sprite(0, 0);
  }
  // copy current data, except subsprite info, to the sprite
  const { subc, ...copied } = data;
  Object.assign(spr, copied);

  // for each of the subsprite data 
  // call the function again
  if(subc) subc.forEach(sub => branchMake(maingroup, sub, spr));
}

branchStructure = {
  text: "MAIN",
  colour: "white",
  subc: [
    {
      text: "PLAY",
      subc: [
        {
          text: "yo"
        }
      ]
    },
    {
      text: "OPTIONS",
      subc: [
        {
          text: "GRAPHICS"
        },
        {
          text: "CONTRO"
        },
        {
          text: "BOMB",
          subc: [
            {
              text: "boom 1"
            }
          ]
        }
      ]
    },
    {
      text: "CREDITS",
      subc: [
        {
          text: "dukemz"
        },
        {
          text: "steak"
        }
      ]
    },
    {
      text: "ACHIEV",
      subc: [
        {
          text: "how"
        }
      ]
    },
  ]
}

function deltaLerp(a, b, f) { // lerp with deltatime
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 75% the remaining distance every second
  return lerp(a, b, 1 - pow(f, avgDeltaTime));
}

function windowResized() {
  canvas.resize(windowWidth - 100, windowHeight - 100);
  background(color("#242838"));
  camera.pos = { x: 0, y: 0 };
}