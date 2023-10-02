// Función que actúa como constructor
function constructor(name, stringValue, numberValue) {
  let _name = name;
  let _stringValue = stringValue;
  let _numberValue = numberValue;

  this.getName = function () {
    return _name;
  };

  this.setName = function (newName) {
    _name = newName;
  };

  this.getStringValue = function () {
    return _stringValue;
  };

  this.setStringValue = function (newStringValue) {
    _stringValue = newStringValue;
  };

  this.getNumberValue = function () {
    return _numberValue;
  };

  this.setNumberValue = function (newNumberValue) {
    _numberValue = newNumberValue;
  };
}

const Interval = {
  MAJOR_THIRD: new constructor('Tercera mayor', '5/4', 5 / 4),
  MINOR_THIRD: new constructor('Tercera menor', '6/5', 6 / 5),
  JUST_FIFTH: new constructor('Quinta justa', '3/2', 3 / 2)
};

function findIntervalByName(param1Value) {
  for (const key in Interval) {
    if (Interval.hasOwnProperty(key)) {
      const enumValue = Interval[key];
      if (enumValue.getname() === param1Value) {
        return enumValue;
      }
    }
  }
  return null;
}

module.exports = { Interval, findIntervalByName };
