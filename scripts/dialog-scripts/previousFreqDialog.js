//Acción botones siguiente
[HTML_setPreviousFreqButton,
    HTML_setPreviousFreqButtonQuick]
    .forEach(element => {
        element.addEventListener("click", () => {
            //Encontrar elemento seleccionado y coger su data-note-id
            let selectedNoteId = HTML_canvasInModal.querySelector(".chord-view-line-container:not(.blurred)").getAttribute("data-note-id")
            //Buscar en el acorde anterior la nota con ese id
            //Por ahora se entiende como acorde anterior el último ya existente 
            let selectedNote = song[song.length - 1].notes.find(note => note.id == selectedNoteId)
            //Marcarle el definesNextChord a true
            selectedNote.definesNextChord = true;
            //Los dos span de previous interval se rellenan con el valor de la frecuencia seleccionada
            userSelectedPreviousFreqValue = selectedNote.freq;

            HTML_previousFreqSpan.innerHTML = userSelectedPreviousFreqValue;
            //Hay que calcular la frecuencia porque el intervalo no tiene porque ser unisono, por ejemplo si hemos navegado hacia atras con otro intervalo
            HTML_newFreqSpan.innerHTML = userSelectedPreviousFreqValue * selectedInterval.numberValue;
        });
    })