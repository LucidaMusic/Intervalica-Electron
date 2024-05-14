/// <reference path="../objects/Note.js" />

module.exports = class Chord {
	constructor(chordId) {
		this.chordId = chordId; //Este id identifica al acorde respecto los demas en la cancion
		this.noteIdCount = 0; //se inicializa a 0 y va incrementando, asignando este valor a las notas del acorde conforme se añaden para identificarlas
		this.name = null;
		this.referenceNoteId = null; 
		this.referenceChordId = null; //La tonica de un acorde viene referenciada por otro acorde y una de sus notas
		this.intervalReferenceNoteAndRoot = null; //Clase Interval
		this.root = null; //Clase Note
		this.mode = null;
		this.modeNotes = []; //Clase Note, Notas que vienen del modo
		this.extensions = [];
		this.extensionsNotes = []; //Clase Note, Notas que vienen de las extensiones
		this.duration = null;
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

	getNoteById(noteId) {
		//Miramos en tonica
		if (this.root.id == noteId) {
			return this.root;
		} else {
			//Miramos en modo
			let selectedPreviousNoteInMode = this.modeNotes.find(note => note.id == noteId);
			if (selectedPreviousNoteInMode != undefined) {
				return selectedPreviousNoteInMode;
			} else {
				//Miramos en extensiones
				console.error("Algo ta mal supongo");
			}
		}
	}
}

