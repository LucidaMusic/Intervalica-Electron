const { Intervals } = require("./Intervals.js");

class Mode {
    constructor(id, name, intervals) {
        this._id = id;
        this._name = name;
        this._intervals = intervals;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get intervals() {
        return this._intervals;
    }

    set id(id) {
        this._id = id;
    }

    set name(name) {
        this._name = name;
    }

    set intervals(intervals) {
        this._intervals = intervals;
    }
}

const Modes = {
    MAJOR: new Mode("M", "Mayor", [Intervals.MAJOR_THIRD, Intervals.PERFECT_FIFTH]),
    MINOR: new Mode("m", "Menor", [Intervals.MINOR_THIRD, Intervals.PERFECT_FIFTH])
};

function findModeById(id) {
    for (const modeKey in Modes) {
        if (Modes[modeKey].id === id) {
            return Modes[modeKey];
        }
    }
    return null; // Retorna null si no se encuentra ningún modo con el ID especificado
}
module.exports = { Modes, findModeById};
