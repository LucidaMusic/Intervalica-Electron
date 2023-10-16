module.exports = class Note {
    constructor(id, freq, intervalFromRoot, isRoot, definesNextChordRoot) {
        this._id = id;
        this._freq = freq;
        this._intervalFromRoot = intervalFromRoot;
        this._isRoot = isRoot;
        this._definesNextChordRoot = definesNextChordRoot;
    }

    // Getters
    get id() {
        return this._id;
    }

    get freq() {
        return this._freq;
    }

    get intervalFromRoot() {
        return this._intervalFromRoot;
    }

    get isRoot() {
        return this._isRoot;
    }

    get definesNextChordRoot() {
        return this._definesNextChordRoot;
    }

    // Setters
    set id(newId) {
        this._id = newId;
    }

    set freq(newFreq) {
        this._freq = newFreq;
    }

    set intervalFromRoot(newInterval) {
        this._intervalFromRoot = newInterval;
    }

    set isRoot(newIsRoot) {
        this._isRoot = newIsRoot;
    }

    set definesNextChordRoot(newDefinesNextChordRoot) {
        this._definesNextChordRoot = newDefinesNextChordRoot;
    }
};
