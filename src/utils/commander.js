const { program } = require("commander")

program
  .option("--mode <mode>", "working mode", "development")
program.parse()

module.exports = program