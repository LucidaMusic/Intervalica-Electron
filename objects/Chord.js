module.exports = class Chord {
  constructor(duration, mode) {
    let _duration = duration;
    let _mode = mode;

    this.getduration = function () {
      return _duration;
    };
    this.setduration = function (newduration) {
      _duration = newduration;
    };

    this.getmode = function () {
      return _mode;
    };
    this.setmode = function (newmode) {
      _mode = newmode;
    };
  }
}