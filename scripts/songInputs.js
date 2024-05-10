//Limitar 1tonica input a 4 caracteres (Decimales??)
HTML_firstFreqInput
  .addEventListener("input", () => {
    const inputValue = HTML_firstFreqInput.value;
    if (inputValue.length >= 4) {
      HTML_firstFreqInput.value = inputValue.slice(0, 4);
    }
  });