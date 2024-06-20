function getBranchedSpritesO(spr, ignore) { // recursively gets ALL sprites connected, not including active
  // spr is the sprite you want to get the branched sprites of
  // ignore is the sprite to ignore along the branch line
  let branchedSprites = [];
  const subspr = getConnectedSprites(spr).filter(s => s.idNum !== ignore.idNum);
  if(subspr.length > 0) {
    // recursive call
    subspr.forEach(s => {
      // add them to the Pile
      const subbr = getBranchedSprites(s, spr);
      branchedSprites.push(...subbr);
    });
    return branchedSprites;
  } else {
    return [];
  }
}

function getBranchedSprites(spr, ignore) {
  const branchedSprites = [];
  // get the sprites attached to spr, except ignore
  const subsprs = getConnectedSprites(spr).filter(s => s.idNum !== ignore.idNum);
  
  subsprs.forEach(s => {
    const subbersprites = getConnectedSprites(s, spr).filter(s => s.idNum !== ignore.idNum);


    branchedSprites.push(subbersprites);
  });
  return branchedSprites;
}


// OLD MOVEMENT SYSTEM
if(kb.pressing("up")) {
  this.vel.y = -5;
} else if(kb.pressing("down")) {
  this.vel.y = 5;
} else {
  this.vel.y = deltaLerp(this.vel.y, 0, 0.999);
}
if(kb.pressing("left")) {
  this.vel.x = -5;
} else if(kb.pressing("right")) {
  this.vel.x = 5;
} else {
  this.vel.x = deltaLerp(this.vel.x, 0, 0.999);
}

// RANDOM OBJECTS
// various objects
this.randomObjs = new this.objects.Group();
this.randomObjs.height = 50;
this.randomObjs.width = 50;
this.randomObjs.drag = 1;
this.randomObjs.rotationDrag = 1;
// assume center is 0, 0
// this needs to be updated to account for camera position
this.randomObjs.x = () => random(-canvas.hw, canvas.hw);
this.randomObjs.y = () => random(-canvas.hh, canvas.hh);
// visual properties
this.randomObjs.stroke = 255;
this.randomObjs.strokeWeight = 2;
// set layer
this.randomObjs.layer = () => {
  const layer = this.objects._getTopLayer() + 1 || 5;
  return layer;
}

this.rocks = new this.randomObjs.Group();
this.rocks.image = () => random(["🗿", "💀"]);
this.rocks.collides(this.player.projectiles, (_p, b) => b.remove());
this.rocks.amount = 5;

this.stars = new this.randomObjs.Group();
this.stars.image = "✨";
this.stars.overlaps(this.player.projectiles, (_p, b) => b.remove());
this.stars.amount = 2;