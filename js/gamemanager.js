"use strict";

class GameManager {
  // NOTE - eventually improve this
  // needs to be able to handle multiple crashes, in the event crash is called more than once
  constructor() {
    console.log("[MANAGER] Initialising...");
    this.ingame = false;
    this.crashed = false;
    this.errdata = {};
    this.errmsg = "";

    this.fpsList = [];
    this.avgFPS = 0;
    this.avgDeltaTime = 0;

    this.gameInstances = 0; // what was i planning to do with this...?

    // ASSETS
    this.assets = {
      levels: {},
      audio: {},
      mods: {} // mods/packs are the same thing
    }

    // audio manager - replaceable module?
    this.audio = new AudioManager();

    // not actually exclusive to q5 anymore, p5play subs it in
    this.q5fpsList = [];
    this.q5avgFPS = 0;

    // get the current fps 10 times a second
    // used to get average FPS over the last 2 seconds
    this.fpsPush = setInterval(() => {
      if(!document.hidden) {
        this.fpsList.push(frameRate());
        // remove first item in list if it goes above 20
        if(this.fpsList.length > 20) this.fpsList.shift();

        this.q5fpsList.push(getFPS());
        if(this.q5fpsList.length > 20) this.q5fpsList.shift();
      }
    }, 100);

    // set error handling
    addEventListener("error", (ev) => {
      const { message, filename, lineno, colno, error } = ev;
      console.log(ev)
      this.crash({
        type: "error",
        eventmsg: message,
        source: filename,
        lineno, colno, error
      });
    });

    // unhandled promise rejection
    addEventListener("unhandledrejection", (event) => {
      this.crash({ type: "promiseReject", event });
    });
    console.log("[MANAGER] Loaded successfully!");
  }

  calculatePerformance() {
    // average deltatime, fps calcs
    this.avgFPS = this.fpsList.reduce((a, b) => a + b, 0) / this.fpsList.length || frameRate();
    this.avgDeltaTime = 1 / this.avgFPS;
    if(this.avgFPS < 2) console.warn(`Warning: Average FPS is ${this.avgFPS.toFixed(3)}!`);

    this.q5avgFPS = this.q5fpsList.reduce((a, b) => a + b, 0) / this.q5fpsList.length || getFPS();
  }

  crash(data) { // data is an object, should contain error
    this.ingame = false;
    clearInterval(this.fpsPush);
    if(!this.crashed) {
      this.crashed = true;
    } else {
      console.error(`WARNING: Attempted to handle a crash on frame ${frameCount} while the game was already crashed (frame ${this.errdata.crashFrame}).`);
    }
    this.errdata = data || {};
    this.errdata.crashFrame = frameCount;
    
    this.setMessage();
    this.crashlog();
    this.crashdraw();

    noLoop();
  }

  setMessage() { // set this.errmsg based on data in this instance
    let msg = ``;
    // error type
    if(this.errdata.type === "promiseReject") {
      msg += `An unhandled promise rejection occurred.\n${this.errdata.event.reason}\n`;
    } else if(this.errdata.type === "setupError") {
      msg += `Game setup failed to complete.\n${this.errdata.error.name}: ${this.errdata.error.message}\n`;
    } else if(this.errdata.type === "drawError") {
      msg += `Draw/update error on frame ${this.errdata.crashFrame}.\n${this.errdata.error.name}: ${this.errdata.error.message}\n`;
    } else if(this.errdata.type === "error") {
      msg += `An uncaught exception occurred.\n`;
      if(this.errdata.error) {
        msg += `${this.errdata.error.name}: ${this.errdata.error.message}\n`;
      } else if(this.errdata.eventmsg) {
        msg += `Event message: ${this.errdata.eventmsg}\n`;
      } else {
        msg += `No error data.\n`;
      }
    } else {
      msg += `Invalid or no error type.\n`;
    }

    if(this.errdata.error) {
      if(this.errdata.fileName) {
        msg += `Source: ${this.errdata.fileName}\nLine ${this.errdata.lineNumber}, col ${this.errdata.columnNumber}`;
      } else if(this.errdata.error.fileName) {
        msg += `Source: ${this.errdata.error.fileName}\nLine ${this.errdata.error.lineNumber}, col ${this.errdata.error.columnNumber}`;
      } else {
        msg += `Unable to provide more error information.`;
      }
    } else if(this.errdata.source) {
      msg += `Source: ${this.errdata.source}`;
    } else {
      msg += `No error data available.`;
    }
    if(navigator.userAgent.indexOf("Firefox") === -1) {
      msg += `\n\nNote: If little or no error data is provided, try running the game in Firefox for additional debug information.`;
    }

    this.errmsg = msg;
  }

  crashlog() { // log crash report to console
    let msg = `%coh no\n%c${this.errmsg}`;
    console.error(msg, "font-size: 27px", "");
    // todo: check if this is actually an instance of Error, if not, just log it to the thing
    if(this.errdata.error) console.error(this.errdata.error.stack);
  }

  crashdraw() { // draw crash report to the canvas
    camera.off();

    push();
    background(0, 0, 0, 200);
    noStroke();
    fill(255, 90, 100);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    // textWrap(WORD);
    textSize(20);

    const maxtextwidth = canvas.w - 20;
    let msg = `${this.errmsg}\n\nPlease check the console for more details.`;
    text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
    textStyle(NORMAL);
    text(msg, 10, 40, maxtextwidth);

    pop();
  }
}

// old error handler
// window.onerror = (event, source, lineno, colno, error) => {
//   console.log(event)
//   this.crash({
//     type: "error",
//     eventmsg: event,
//     source, lineno, colno, error
//   });
// };