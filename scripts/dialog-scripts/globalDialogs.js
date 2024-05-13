/// <reference path="../../objects/Chord.js" />

function hideShownDialogs() {
	[HTML_modalBackground,
		HTML_previousFreqModal,
		HTML_previousIntervalModal,
		HTML_chordDurationModal,
		durationErrorText,
		HTML_chordIntervalsModal,
		HTML_octavationModal]
		.forEach(dialog => {
			if (!dialog.classList.contains(CSS_noDisplay)) {
				hideElement(dialog)
			}
		});
}

function showDialog(dialog) {
	showElement(HTML_modalBackground)
	showElement(dialog)
}

//Esto da la funcionalidad a los botones de desplazarse a otra pagina de manera general
//Se supone que si puedo avanzar de pagina es porque los datos estan establecidos.
//Para guardar datos o más funcionalidades se usan eventListeners especñificos para evitar problemas de simetria (ir a una pagina != volver a la misma pagina)
document.querySelectorAll("[data-go-to]")
	.forEach(element => {
		element
			.addEventListener("click", () => {
				hideShownDialogs();
				switch (element.getAttribute("data-go-to")) {
					case "close":
						resetModalValues();
						break;
					case "previous-freq-modal":
						showDialog(HTML_previousFreqModal);
						break;
					case "previous-interval-modal":
						showDialog(HTML_previousIntervalModal);
						break;
					case "chord-duration-modal":
						showDialog(HTML_chordDurationModal);
						break;
					case "chord-intervals-modal":
						showDialog(HTML_chordIntervalsModal);
						break;
					case "octavation-modal":
						showDialog(HTML_octavationModal);
						break;
					case "finish-chord-creation":
				}
			});
	});

function resetModalValues() {
	//Previous Freq
	HTML_clickedPreviousFreqSpan.innerHTML = null;
	HTML_previousFreqChordView.innerHTML = '';
	HTML_durationInput.value = null;
	showErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
	//Previous Interval
	selectedInterval = Intervals.UNISON;
	HTML_previousIntervalSelect.selectedIndex = 0;
}

function PreparePrevFreqCanvas(chord) {
	//Limpiamos el contenido que pudiera haber
	HTML_previousFreqChordView.innerHTML = '';
	paintGenericLinesOnCanvas(chord, HTML_previousFreqChordView, false);

	//Hacemos que las barras tengan la funcionalidad de ser seleccionadas y su numero mostrado aparte
	HTML_previousFreqChordView.addEventListener("click", function (event) {
		const HTML_chordViewLineContainer = event.target.closest(".chord-view-line-container");
		if (HTML_chordViewLineContainer) {
			// Obtener valor de frecuencia
			let noteId = HTML_chordViewLineContainer.getAttribute("data-note-id");
			let selectedPreviousNoteInMode = song[song.length - 1].getNoteById(noteId);

			HTML_previousFreqPreviewSpan.innerHTML = selectedPreviousNoteInMode.freq;

			//Devuelve el valor blurred al que ya estaba seleccionado (si lo estaba)
			HTML_previousFreqChordView.querySelectorAll(".chord-view-line-container:not(.blurred)")
				.forEach(element => element.classList.add("blurred"));

			//Dejamos seleccionado el numero que sea
			HTML_chordViewLineContainer.classList.remove("blurred")

			//Además se esconde el texto de error
			hideErrorText(HTML_previousFreqErrorText, HTML_setPreviousFreqButtonQuick, HTML_setPreviousFreqButton)
		}
	});
}

function paintLinesOnModesAndExtensionsCanvas(chord) {
	paintGenericLinesOnCanvas(chord, HTML_canvasMode, false);
}

function paintGenericLinesOnCanvas(chord, canvas, relativeToSong) {
	//Actualmente solo pintamos freqs
	let chordFreqs = [];
	chordFreqs.push(chord.root.freq);
	chord.modeNotes.map(note => note.freq).forEach(freq => chordFreqs.push(freq))
	chord.extensionsNotes.map(note => note.freq).forEach(freq => chordFreqs.push(freq))

	let maxFreqValue, minFreqValue;

	if (relativeToSong) {
		//Esto solo se usa para chordview
		//Recojo todas las notas para calcular la frecuencia maxima y minima
		let allNotes = new Array();
		song.forEach(chord => {
			allNotes.push(chord.root);
			chord.modeNotes.forEach(note => allNotes.push(note));
			chord.extensionsNotes.forEach(note => allNotes.push(note));
		});

		allNotes = allNotes.map(note => note.freq);

		maxFreqValue = Math.max(...allNotes); //!!! Si han cambiado los valores hay que volver a pintar los acordes ya pintados
		minFreqValue = Math.min(...allNotes);
	} else {      //Default is relative to chord
		maxFreqValue = Math.max(...chordFreqs);
		minFreqValue = Math.min(...chordFreqs);
	}

	//Dado que necesito mas espacio
	//Esto se puede calcular teniendo en cuenta el tamaño de las letras
	maxFreqValue *= 1.2;
	minFreqValue *= 0.8;

	let height = 500; //Height real del canvas o contenedor

	//Pintar la tonica (por separado)(Es interesante el rol de la nota al dibujarla)
	let lineParent = getHtmlNoteForCanvas(chord.root.freq, minFreqValue, maxFreqValue, height);
	lineParent.setAttribute("data-note-id", chord.root.id);
	lineParent.classList.add("nota-tonica")
	canvas.appendChild(lineParent);

	//Pintar las notas que vienen de extensiones
	for (let i = 0; i < chord.modeNotes.length; i++) {
		lineParent = getHtmlNoteForCanvas(chord.modeNotes[i].freq, minFreqValue, maxFreqValue, height);
		lineParent.setAttribute("data-note-id", chord.modeNotes[i].id) //esto de momento solo pinta freqs
		lineParent.classList.add("nota-extension")
		canvas.appendChild(lineParent);
	}

	return canvas;
}

function getHtmlNoteForCanvas(freq, minFreqValue, maxFreqValue, height) {
	//Establecemos valores que sirven para calcular punto y de las lineas en escala logarítmica 
	let minLogFreq = Math.log(minFreqValue) / Math.log(10);
	let logRange = (Math.log(maxFreqValue) / Math.log(10)) - minLogFreq;

	let yPosition = (Math.log(freq) / Math.log(10) - minLogFreq) / logRange * height;

	//Dinujamos linea
	let line = document.createElement("div");
	line.classList.add("chord-view-line");

	//Dibujamos numero
	let number = document.createElement("span");
	number.classList.add("chord-view-line-number");
	number.innerHTML = freq;

	//Dibujamos parent
	let lineParent = document.createElement("div");
	lineParent.append(number, line);
	lineParent.style.bottom = yPosition + "px";
	lineParent.classList.add("chord-view-line-container");

	return lineParent;
}