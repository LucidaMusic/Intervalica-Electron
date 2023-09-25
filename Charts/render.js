//Datos de entrada
let song_min_freq = 330;
let song_max_freq = 880;

//Dado que necesito mas espacio
song_max_freq *= 1.2;
song_min_freq *= 0.8;

let chordFreqs = [330, 440, 550, 660, 770, 880];

//Recuperar canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Recuperar tamaño de canvas
let canvasHeight = canvas.clientHeight;
let canvasWidth = canvas.clientWidth;

//Estilo ctx
ctx.lineWidth = 6;
let fontSize = 20;
ctx.font = fontSize + "px Arial";

//Estilo general
let freqBarStartingPoint = 45;



//Tonica de color especial
ctx.strokeStyle = "#59bfff";
ctx.fillStyle = "#59bfff";

//Establecemos valores que sirven para calcular punto y de
let min_f = Math.log(song_min_freq) / Math.log(10),
    max_f = Math.log(song_max_freq) / Math.log(10),
    range = max_f - min_f;

//Comenzamos a pintar
ctx.beginPath();

//Para cada nota en el acorde
for (let i = 0; i < chordFreqs.length; i++) {
    //Leemos el valor de la frecuencia
    let chordFreq = chordFreqs[i];

    //Calculamos posición en Y para la barra y el texto
    let yPosition = canvas_calculateFreqBarYPosition(chordFreq);

    //Dibujamos barra
    canvas_drawFreqBar(yPosition)

    //Insertamos texto
    ctx.fillText(paddingWithZero(chordFreq), 0, yPosition + (fontSize / 2) - 2);

    ctx.stroke();
    //Para el resto de notas, el color es negro 
    //(Las notas que son tonicas deben venir con un campo que las ditsinga, y que se aplique estilos de tonica de forma excepcional a ellos)
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
}

//Cerramos
//ctx.stroke();

//Dibuja la barra en el canvas
function canvas_drawFreqBar(y) {
    ctx.moveTo(freqBarStartingPoint, y);
    ctx.lineTo(canvasWidth, y);
}

//Encuentra cual sería la posición Y de la barra y texto de una nota teniendo en cuenta la frecuencia 
//mayor y menor de la canción, en función a la frecuencia
function canvas_calculateFreqBarYPosition(frequency) {
    position_px = (Math.log(frequency) / Math.log(10) - min_f) / range * canvasHeight;
    //Supongo
    position_px = canvasHeight - position_px;
    return position_px;
}

function paddingWithZero(frecuencyNumber) {
    console.log(frecuencyNumber)
    frecuencyNumber = frecuencyNumber + '';
    //Por ahora la máxima frecuencia posible es de 4 dígitos
    let zerosNeeded = 4 - frecuencyNumber.length;
    console.log(zerosNeeded);
    console.log(frecuencyNumber.length)
    for (let i = 0; i < zerosNeeded; i++) {
        frecuencyNumber = " " + frecuencyNumber;
        console.log(frecuencyNumber)
    }

    return frecuencyNumber;
}