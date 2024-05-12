//HTML Variables
//Main page
const HTML_firstFreqInput = document.getElementById("freq-input");

//Chord bar
const HTML_chordBar = document.getElementById("chord-bar");
const HTML_newChordButton = document.getElementById("new-chord-button");

//Dialogs
const HTML_modalBackground = document.getElementById("modal-background");

//Previous Freq
const HTML_previousFreqModal = document.getElementById("previous-freq-modal");
const HTML_clickedPreviousFreqSpan = document.getElementById("previous-freq-span");
const HTML_previousFreqErrorText = document.getElementById("previous-freq-error-text");
const HTML_setPreviousFreqButton = document.getElementById("set-previous-freq");
const HTML_setPreviousFreqButtonQuick = document.getElementById("set-previous-freq-quick");
const HTML_previousChordName = document.getElementById("previous-chord-name");
const HTML_previousFreqChordView = document.getElementById("previous-freq-chord-view");
//Previous Interval
const HTML_previousIntervalModal = document.getElementById("previous-interval-modal");
const HTML_previousFreqSpan = document.getElementById("previous-freq");
const HTML_newFreqSpan = document.getElementById("new-freq");
const HTML_intervalFractionValueSpan = document.getElementById("interval-fraction-value");
const HTML_previousIntervalSelect = document.getElementById("previous-interval-select");
const HTML_setPreviousIntervalButton = document.getElementById("set-previous-interval-button")
//Mode and extensions
const HTML_chordIntervalsModal = document.getElementById("chord-intervals-modal");
const HTML_modeUl = document.getElementById("mode-ul")
const HTML_noModesContainer = document.querySelector(".no-modes-container");
const HTML_modeToggler = document.getElementById("mode-toggler");
const HTML_modeTogglerText = document.getElementById("mode-toggler-text");
const HTML_extensionsUl = document.getElementById("extensions-ul");
const HTML_backToIntervalsParents = document.getElementById("return-to-intervals-parents-button");
const HTML_addIntervalButton = document.getElementById("add-interval-button");
const HTML_canvasMode = HTML_chordIntervalsModal.querySelector(".chord-view");


function showElement(element) {
  element.classList.remove(CSS_noDisplay)
}

function hideElement(element) {
  element.classList.add(CSS_noDisplay)
}

function showErrorText(errorText, ...buttonToDisable) {
  errorText.classList.remove("transparent-text");
  buttonToDisable.forEach(button => button.disabled = true);
}

function hideErrorText(errorText, ...buttonToEnable) {
  errorText.classList.add("transparent-text");
  buttonToEnable.forEach(button => button.disabled = false);
}

function selectElement(element) {
  element.classList.add(CSS_selected);
}

function unselectElement(element) {
  element.classList.remove(CSS_selected);
}
