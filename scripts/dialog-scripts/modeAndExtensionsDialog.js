/// <reference path="../global.js" />
/// <reference path="globalDialogs.js" />

let modeAndExtensionsProvisionalChord;

HTML_modeToggler.addEventListener("click", () => {
    // Cambiar el estado de isMoved y actualizar el estilo
    noModes = !noModes;
    HTML_noModesContainer.style.transform = noModes ? "translateY(0)" : "translateY(100%)";
    HTML_modeTogglerText.innerHTML = noModes ? "Sí quiero elegir un modo" : "No quiero elegir ningún modo"
});

//Los modos se seleccionan cuando son clicados
//Se que son modos si son figures dentro de mode-ul
HTML_modeUl //Cambiar nombre? modeList(Container)?
    .querySelectorAll("figure")
    .forEach(figure => {
        figure
            .addEventListener("click", () => {
                unselectElement(HTML_modeUl.querySelector("figure." + CSS_selected));
                selectElement(figure);
                updateModeCanvas();
            });
    });

//Los intervalos, cuando son clicados, muestran sus hijos
HTML_extensionsUl.querySelectorAll(".parent")
    .forEach(parent => {
        parent
            .addEventListener("click", () => {
                //Esconder todos los padres
                HTML_extensionsUl
                    .querySelectorAll(".parent")
                    .forEach(parent => hideElement(parent))

                //Mostrar los hijos de ese padre concreto
                let classOfChildToShow = parent.getAttribute("data-value");

                HTML_extensionsUl
                    .querySelectorAll("." + classOfChildToShow)
                    .forEach(child => showElement(child))

                //Mostrar boton para volver
                showElement(HTML_backToIntervalsParents)
            });
    });

//Los hijos, cuando son clicados, se seleccionan y muestran el botón añadir.
HTML_extensionsUl
    .querySelectorAll(".child")
    .forEach(figure => {
        figure
            .addEventListener("click", () => {
                //Deseleccionar si ya había algo seleccionado, dado que los intervalos son opcionales y no tienen un default claro. No tendria que haber mas de un selected
                deselectPossiblySelectedChildInterval();
                selectElement(figure)
                showElement(HTML_addIntervalButton);
            });
    });


//boton volver esconde los hijos, muestra los padres y se esconde a si mismo
HTML_backToIntervalsParents.addEventListener("click", () => {
    //Se entiende que si se había seleccionado algo antes, se descarta
    deselectPossiblySelectedChildInterval();
    //buscar todos los child que NO tengan no display y esconderlos
    HTML_extensionsUl.querySelectorAll(".child:not(." + CSS_noDisplay + ")")
        .forEach(element => hideElement(element))
    //buscar todos los parents y mostrarlos
    HTML_extensionsUl.querySelectorAll(".parent")
        .forEach(element => showElement(element))
    //Se esconde a sí mismo
    hideElement(HTML_backToIntervalsParents)
    //Esconde el boton añadir dado que estoy en parents
    hideElement(HTML_addIntervalButton)
})

function deselectPossiblySelectedChildInterval() {
    const selectedChildInterval = HTML_extensionsUl.querySelector(".child." + CSS_selected)
    if (selectedChildInterval) {
        unselectElement(selectedChildInterval)
    }
}

//El boton + añade el intervalo
HTML_addIntervalButton
    .addEventListener("click", () => {
        //busco los intervals child
        const intervalId = HTML_extensionsUl.querySelector(".child.selected").getAttribute("data-value")
        //   busco el que tenga la clase selected !Solo debe haber uno
        //  cojo su data value
        // busco el intervalo y lo pinto Deberia insertar objetos html

        // Crear un elemento <p>
        var HTML_chosenInterval = document.createElement("p");

        // Establecer el texto dentro del párrafo
        HTML_chosenInterval.textContent = getIntervalById(intervalId).name;

        // Agregar el párrafo al cuerpo del documento (u otro elemento, según tu necesidad)
        HTML_chordIntervalsModal.appendChild(HTML_chosenInterval);

        //   a la hora de recuperar el valor podria volver a leer los elementos para no tener que mantener una lista sincronizada de intervalos
    });

function updateModeCanvas() {
    //Reiniciar canvas mode
    HTML_canvasMode.innerHTML = "";
    modeAndExtensionsProvisionalChord = new Chord();

    //Añadimos la nota de la tonica al acorde provisional
    modeAndExtensionsProvisionalChord.addRootNote(new Note(getIntervalById(getSelectedPreviousInterval()), 0, 
    getSelectedPreviousFreq() * getIntervalById(getSelectedPreviousInterval()).numberValue)); 
    
    //Añadimos las notas del modo al acorde provisional
    findModeById(getSelectedModeValue())
    .intervals
        .map(interval => new Note(interval, 0, interval.numberValue * modeAndExtensionsProvisionalChord.root.freq))
        .forEach(note => modeAndExtensionsProvisionalChord.addModeNote(note)); 

    //Omitimos extensiones por ahora 

    //Pintamos las frecuencias en el canvas
    paintLinesOnModesAndExtensionsCanvas(modeAndExtensionsProvisionalChord)
}

function getSelectedModeValue() {
    return HTML_modeUl.querySelector("figure." + CSS_selected).getAttribute("data-mode-id");
}