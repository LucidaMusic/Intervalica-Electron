// Función que actúa como constructor
function constructor(name, stringValue, numberValue) {
  let _name = name;
  let _stringValue = stringValue;
  let _numberValue = numberValue;

  // Getter y Setter para name
  this.getname = function () {
    return _name;
  };
  this.setname = function (newname) {
    _name = newname;
  };

  // Getter y Setter para stringValue
  this.getstringValue = function () {
    return _stringValue;
  };
  this.setstringValue = function (newstringValue) {
    _stringValue = newstringValue;
  };

  // Getter y Setter para numberValue
  this.getnumberValue = function () {
    return _numberValue;
  };
  this.setnumberValue = function (newnumberValue) {
    _numberValue = newnumberValue;
  };
}

// "Enum" simulado
const Interval = {
  MAJOR_THIRD: new constructor('Tercera mayor', '5/4', 5 / 4),
  MINOR_THIRD: new constructor('Tercera menor', '6/5', 6 / 5),
  JUST_FIFTH: new constructor('Quinta justa', '3/2', 3 / 2)
};

// Función para encontrar un valor en el enum basado en un parámetro
function findIntervalByName(param1Value) {
  for (const key in Interval) {
    if (Interval.hasOwnProperty(key)) {
      const enumValue = Interval[key];
      if (enumValue.getname() === param1Value) {
        return enumValue;
      }
    }
  }
  return null; // Valor no encontrado
}

// Exporta el enum para que esté disponible para su uso en otros archivos
module.exports = { Interval, findIntervalByName };
