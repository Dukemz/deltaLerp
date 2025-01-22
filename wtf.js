// tower of hanoi implementation in js
"use strict";

const discs = 10; // number of discs

// calculate the minimum number of moves required to solve the puzzle
const minmoves = (2 ** discs) - 1;
console.log(`${discs} discs, ${minmoves} minimum possible moves`);

// initialize towers as arrays
const t1 = []; // first tower with all discs initially
const t2 = []; // second tower (empty initially)
const t3 = []; // third tower (empty initially)

// populate the first tower with discs in descending order
for(let i = discs; i > 0; i--) {
  t1.push(i);
}

let moves = 0;
let longestTime = 0;

// function to visualize the state of all towers
function vis() {
  const maxTowerHeight = Math.max(t1.length, t2.length, t3.length); // find the tallest tower to determine rows to display
  const towerWidth = discs * 2 + 1; // determine fixed width for discs for consistent formatting
  console.log(`\nMove ${moves}, current state:`);

  // iterate from the topmost row to the bottommost row
  for(let i = maxTowerHeight - 1; i >= 0; i--) {

    // this replaces the current number with a pole if it doesn't exist
    const row = [t1[i] || "|", t2[i] || "|", t3[i] || "|"].map(disc => { // ...and applies a map func

      if(disc === "|") {
        // if there are no discs in the current row, display an empty pole
        return " ".repeat((towerWidth - 1) / 2) + "|" + " ".repeat((towerWidth - 1) / 2);
      } else {
        // create a string representing the disc with "#" symbols
        const discStr = "#".repeat(disc * 2 - 1); // width of the disc is proportional to its size
        // calculate padding for center alignment
        const padding = (towerWidth - discStr.length) / 2;
        return " ".repeat(padding) + discStr + " ".repeat(padding);
      }

    });
    console.log(row.join("   ")); // join the three towers with spacing in between
  }

  // display the labels for the towers below the visualization
  console.log("Tower 1".padStart(towerWidth, " ") + "   Tower 2".padStart(towerWidth + 3, " ") + "   Tower 3".padStart(towerWidth + 3, " "));
}

// recursive function to solve the Tower of Hanoi puzzle
function solve(n, source, target, auxiliary) {
  // n - number of discs
  // source - tower to move from
  // target - tower to move to
  // auxiliary - helper

  if(n === 0) {
    return; // base case: no discs to move
  }

  // move n-1 discs from source to auxiliary using target as a helper
  solve(n - 1, source, auxiliary, target);

  let t = performance.now();
  // move the nth disc from source to target
  const disc = source.pop();
  target.push(disc);

  // visualize the towers after each move
  moves++;
  console.log(`Move disc ${disc} from Tower ${source.name} to Tower ${target.name}`);
  vis();

  // performance
  const timetaken = performance.now() - t;
  console.log(`time: ${timetaken.toFixed(3)}ms`);
  if(timetaken > longestTime) longestTime = timetaken;

  // move n-1 discs from auxiliary to target using source as a helper
  solve(n - 1, auxiliary, target, source);
}

// attach names to the towers
t1.name = "1";
t2.name = "2";
t3.name = "3";

vis(); // initial state
const startTime = performance.now();

solve(discs, t1, t3, t2); // solve
console.log(`\nTotal moves: ${moves}, min theoretically possible moves: ${minmoves}`);
console.log(`total time taken = ${(performance.now() - startTime).toFixed(3)}ms, longest calculation: ${longestTime.toFixed(3)}ms`)