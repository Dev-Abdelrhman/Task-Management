const chalk = require("chalk");

const displayEvent = (label, data) => {
  const labelColor = chalk.hex("#00FFFF").bold(`[${label}]`);
  process.stdout.write(`${labelColor} ${JSON.stringify(data)}\n`);
};

const emitEvent = (io, label, data) => {
  io.emit(label, data);
  displayEvent(label, data);
};

module.exports = { displayEvent, emitEvent };
