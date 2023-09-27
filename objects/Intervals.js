// Función que actúa como constructor
function constructor(name, stringValue, numberValue) {
  let _name = name;
  let _stringValue = stringValue;
  let _numberValue = numberValue;

  this.getname = function () {
    return _name;
  };

  this.setname = function (newname) {
    _name = newname;
  };

  this.getstringValue = function () {
    return _stringValue;
  };

  this.setstringValue = function (newstringValue) {
    _stringValue = newstringValue;
  };

  this.getnumberValue = function () {
    return _numberValue;
  };

  this.setnumberValue = function (newnumberValue) {
    _numberValue = newnumberValue;
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
