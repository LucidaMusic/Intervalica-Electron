/// <reference path="../objects/Note.js" />

module.exports = class Chord {
    constructor() {
        this.chordId = null; //Este id identifica al acorde respecto los demas en la cancion
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

    setNoteId(note) {
        note.id = this.noteIdCount;
        this.noteIdCount += 1;
    }

    addRootNote(note) {
        this.setNoteId(note);
        this.root = note;
    }

    addModeNote(note) {
        this.setNoteId(note);
        this.modeNotes.push(note);
    }

    addExtensionNote(note) {
        this.setNoteId(note);
        this.extensions.push(note);
    }
}

