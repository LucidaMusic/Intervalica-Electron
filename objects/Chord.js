/* class Chord {
  constructor(duration, lastRootInterval, intervalsList) {
    this.duration = duration;
    this.lastRootInterval = lastRootInterval;
    this.intervalsList = intervalsList;
  }


} */

module.exports = class Chord {
  constructor(duration) {
    this.duration = duration;
  }

  get duration() { return this._duration }
  set duration(value) { this._duration = value }
}