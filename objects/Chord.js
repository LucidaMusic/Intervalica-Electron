module.exports = class Chord {
  constructor(duration, mode, contextualizedFreqs) {
    let _duration = duration;
    let _mode = mode;
    let _contextualizedFreqs = contextualizedFreqs;

    this.getDuration = function () {
      return _duration;
    };

    this.setDuration = function (newduration) {
      _duration = newduration;
    };

    this.getMode = function () {
      return _mode;
    };

    this.setMode = function (newmode) {
      _mode = newmode;
    };

    this.getContextualizedFreqs = function () {
      return _contextualizedFreqs;
    };

    this.setContextualizedFreqs = function (newcontextualizedFreqs) {
      _contextualizedFreqs = newcontextualizedFreqs;
    };

    function contextualize(freq){
      
    }
  }
};