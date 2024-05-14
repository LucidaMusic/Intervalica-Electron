/// <reference path="../objects/Intervals.js" />

module.exports = class Note {
  constructor(interval, octavePonderation, freq) {
    this.id = -1; //Este es un valor invalido porque es al añadir la nota al acorde cuando tiene sentido ponerle un id, este id solo diferencia la nota en su acorde
    this.interval = interval; //Clase Intervals
    this.octavePonderation = octavePonderation; //Numero de octavas que sube o baja (Ej: 1, -1, 3...)
    this.freq = freq;
  }
};
