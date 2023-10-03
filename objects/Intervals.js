// Función que actúa como constructor
class Interval {
  constructor(name, stringValue, numberValue) {

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
}

const Intervals = {
  UNISON: new Interval('Unísono', '1', 1),
  MINOR_SECOND: new Interval('Segunda menor', '16/15', 16 / 15),
  MAJOR_SECOND: new Interval('Segunda mayor', '9/8', 9 / 8),
  MINOR_THIRD: new Interval('Tercera menor', '6/5', 6 / 5),
  MAJOR_THIRD: new Interval('Tercera mayor', '5/4', 5 / 4),
  PERFECT_FOURTH: new Interval('Cuarta justa', '4/3', 4 / 3),
  TRITONE: new Interval('Tritono', '45/32', 45 / 32),
  PERFECT_FIFTH: new Interval('Quinta justa', '3/2', 3 / 2),
  MINOR_SIXTH: new Interval('Sexta menor', '8/5', 8 / 5),
  MAJOR_SIXTH: new Interval('Sexta mayor', '5/3', 5 / 3),
  MINOR_SEVENTH: new Interval('Séptima menor', '16/9', 16 / 9),
  DOMINANT_SEVENTH: new Interval('Séptima de dominante', '7/4', 7 / 4),
  MAJOR_SEVENTH: new Interval('Séptima mayor', '15/8', 15 / 8),
};

function findIntervalByName(intervalName) {
  for (const key in Intervals) {
    if (Intervals.hasOwnProperty(key)) {
      const enumValue = Intervals[key];
      if (enumValue.getName() === intervalName) {
        return enumValue;
      }
    }
  }
  return null;
}

module.exports = { Interval, findIntervalByName };
