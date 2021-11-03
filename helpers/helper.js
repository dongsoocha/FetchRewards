const fs = require("fs");

const newDate = () => new Date().toString();

// Write to transactions.json file to keep track of inserting and outgoing transactions + modifications
function writeToJSON(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8", (err) => {
    if (err) console.log(err);
  });
}

module.exports = {
  newDate,
  writeToJSON,
};
