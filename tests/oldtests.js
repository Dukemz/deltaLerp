// funny batch logo
const testimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAdCAIAAABE/PnQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAG1SURBVEhLzZY/UoNAFMZZx8bO1rEylXcQKi8BHkHkBHEmOGNS2UU8gnAJKziApZUewxK/t99mk3GAhQQcf0M2uw/yvvdnl4kKw9CbjKIoRCCOY2MYlSzLtgL3yxNjHo+z0ycIHJvVvjzOvzEGQVCW5a8Ji3+Ez6QcKoBIQeOETN5k0wMsOBmLbdDIAG3BWI8KfcL/P2tytMGsezBAAH5zDeqrlDJWF+6Dpm4eMIb1B8aqqux2gF6hLmGHJC2NODKA9/p1sV4urlbixfd9uz3gHbdg787GVaI8hcbdhYeL2Azg/fnLS+aSXwetAvArxYlSLm1jbQa0lLfXGDuS6MoAMXJEpBabAUqEtN7Pfez69WfdptHeZBRHf7MN3ipPZgpHX9sExC4lmqlkk2UjPbZpLr9HsIwUFyeI3dkAoe1VwYMO6FRmiDRK5XXPkKMUj/HtD/gri/tVgd2N5+gLdTBO9U5FTpRE9YKXN0zkyRZ6lMiiayVbi5J66cQhgE6KLz2RMBH7Um8tjWjkUij9bDMOARSEvqQyGuoR3jKLFoaUaKeTZt2DYQJ78Cd/vIxhAnZP/jR43g8mcFyLHdrIDAAAAABJRU5ErkJggg==";
window.oogle = loadImage(testimg);

enemy.delete = () => {
  for(let subenemy of this.subenemies) {
    // recursive
    subenemy.delete();
  }
  this.sprites.remove();

  const enemindex = this.game.enemies.indexOf(this);
  this.game.enemies.splice(enemindex, 1);
}

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