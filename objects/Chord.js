module.exports = class Chord {
  constructor(name, duration, mode, previousInterval, contextualizedFreqs) {
    let _name = name;
    let _duration = duration;
    let _mode = mode;
    let _previousInterval = previousInterval;
    let _contextualizedFreqs = contextualizedFreqs;

    this.getName = function () {
      return _name;
    };

    this.setName = function (newName) {
      _name = newName;
    };

    this.getDuration = function () {
      return _duration;
    };

    this.setDuration = function (newDuration) {
      _duration = newDuration;
    };

    this.getMode = function () {
      return _mode;
    };

    this.setMode = function (newMode) {
      _mode = newMode;
    };

    this.getPreviousInterval = function () {
      return _previousInterval;
    };

    this.setPreviousInterval = function (newPreviousInterval) {
      _previousInterval = newPreviousInterval;
    };

    this.getContextualizedFreqs = function () {
      return _contextualizedFreqs;
    };

    this.setContextualizedFreqs = function (newContextualizedFreqs) {
      _contextualizedFreqs = newContextualizedFreqs;
    };

    function contextualize(freq){
      
    }
  }
};