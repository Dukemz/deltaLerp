window.gameCrashed = true;
console.error(`%coh no\n%cGame setup failed to complete.\n${err.name}: ${err.message}`, "font-size: 27px", "");
console.error(err.stack);
noLoop();

let errmsg = `Game setup failed to complete.\n${err.name}: ${err.message}\n`;
if (err.fileName) {
  errmsg += `\nSource: ${err.fileName}\nLine ${err.lineNumber}, col ${err.columnNumber}\n`;
} else {
  errmsg += `\nMore information can be provided when running the game in Firefox.\n`;
}
errmsg += `\nPlease check the console for more details.`;
drawError(errmsg)

pop();


window.gameCrashed = true;
// according to mdzn, event should be human readable message explaining the problem
console.error(`%coh no\n%c${event}\nSource = ${source}\nLine ${lineno}, col ${colno}`, "font-size: 27px", "");
if (error) {
  console.error(`Stack trace:\n${error.stack}`);
}
noLoop();
// let errmsg = `${event}\nSource: ${source}\n`;
if (error) {
  errmsg += `Line ${lineno}, col ${colno}\n`;
}
errmsg += `\nPlease check the console for more details.`;
drawError(errmsg);

pop();

window.gameCrashed = true;
  console.error(`%coh no\n%cUnhandled promise rejection: ${event.reason}`, "font-size: 27px", "");
  noLoop();

  // let errmsg = `Unhandled promise rejection: ${event.reason}\negg\n`;
  errmsg += `\nPlease check the console for more details.`;
  drawError(errmsg);

  pop();