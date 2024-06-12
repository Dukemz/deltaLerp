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