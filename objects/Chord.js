module.exports = class Chord {
    constructor() {
        this._id= null;
        this._name = null;
        this._duration = null;
        this._mode = null;
        this._extensions = null;
        this._previousInterval = null;
        this._notes = [];
        this._noteIDThatDefinesNexChord= null; //poner getters y setters
    }

    // Getters
    get name() {
        return this._name;
    }

    get duration() {
        return this._duration;
    }

    get mode() {
        return this._mode;
    }

    get extensions() {
        return this._extensions;
    }

    get previousInterval() {
        return this._previousInterval;
    }

    get notes() {
        return this._notes;
    }

    // Setters
    set name(name) {
        this._name = name;
    }

    set duration(duration) {
        this._duration = duration;
    }

    set mode(mode) {
        this._mode = mode;
    }

    set extensions(extensions) {
        this._extensions = extensions;
    }

    set previousInterval(previousInterval) {
        this._previousInterval = previousInterval;
    }

    addNote(note) {
        this._notes.push(note);
    }
}

