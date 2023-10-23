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
    MINOR: new Mode("m", "Menor", [Intervals.MINOR_THIRD, Intervals.PERFECT_FIFTH]),
    AUGMENTED: new Mode("aug", "Aumentado", [Intervals.MAJOR_THIRD, Intervals.MINOR_SIXTH]), //Aumentado es minor sixth?
    DIMINISHED: new Mode("dim", "Disminuido", [Intervals.MINOR_THIRD, Intervals.TRITONE]),
    SUS2: new Mode("sus2", "Suspendido de segunda", [Intervals.MAJOR_SECOND, Intervals.PERFECT_FIFTH]),
    SUS4: new Mode("sus4", "Suspendido de cuarta", [Intervals.PERFECT_FOURTH, Intervals.PERFECT_FIFTH]),
};

function findModeById(id) {
    for (const modeKey in Modes) {
        if (Modes[modeKey].id === id) {
            return Modes[modeKey];
        }
    }
    return null; // Retorna null si no se encuentra ningún modo con el ID especificado
}
module.exports = { Modes, findModeById };
