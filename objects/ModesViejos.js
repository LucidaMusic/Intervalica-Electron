/* const { Intervals } = require("./Intervals.js");

function constructor(id, name, intervalsList) {
  let _id = id;
  let _name = name;
  let _intervalsList = intervalsList;


  this.getName = function () {
    return _name;
  };

  this.setName = function (newname) {
    _name = newname;
  };

  this.getIntervalsList = function () {
    return _intervalsList;
  };

  this.setIntervalsList = function (newintervalsList) {
    _intervalsList = newintervalsList;
  };
};

const Mode = {
  MAJOR: new constructor("M", "Mayor", [Intervals.MAJOR_THIRD, Intervals.JUST_FIFTH]),
  MINOR: new constructor("m", "Menor", [Intervals.MAJOR_THIRD, Intervals.JUST_FIFTH])
};

function findModeByName(name) {
  for (const mode in Mode) {
    if (Mode.hasOwnProperty(mode)) {
      const enumValue = Mode[mode];
      if (enumValue.getName() === name) {
        return enumValue;
      }
    }
  }
  return null;
}
function findModeById(id) {
  for (const mode in Mode) {
    if (Mode.hasOwnProperty(mode)) {
      const enumValue = Mode[mode];
      if (enumValue.getName() === name) {
        return enumValue;
      }
    }
  }
  return null;
}

module.exports = { Mode, findModeByName }; */