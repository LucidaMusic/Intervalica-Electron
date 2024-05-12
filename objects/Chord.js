/// <reference path="../objects/Note.js" />

module.exports = class Chord {
    constructor(chordId) {
        this.chordId = chordId; //Este id identifica al acorde respecto los demas en la cancion
        this.name = null;
        this.previousReferenceNoteId = null; //poner getters y setters
        this.previousInterval = null; //Clase Interval
        this.mode = null;
        this.extensions = [];
        this.duration = null;
        this.root = null; //Clase Note
        this.modeNotes = []; //Clase Note, Notas que vienen del modo
        this.extensionsNotes = []; //Clase Note, Notas que vienen de las extensiones
        this.noteIdCount = 0;
    }

    assignIdToNote(note) {
        note.id = this.noteIdCount;
        this.noteIdCount += 1;
    }

    addRootNote(note) {
        this.assignIdToNote(note);
        this.root = note;
    }

    addModeNote(note) {
        this.assignIdToNote(note);
        this.modeNotes.push(note);
    }

    addExtensionNote(note) {
        this.assignIdToNote(note);
        this.extensions.push(note);
    }
}

