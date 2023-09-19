module.exports = {
    generateAudioArrayFromNote: (freq) => {
        //Por ahora samplerate es fijo y la duracion tambien
        const sampleRate = 44100;
        const sineWaveArray = new Float32Array(sampleRate);
        for (i = 0; i < sineWaveArray.length; i++) {
            sineWaveArray[i] = Math.sin(i * Math.PI * 2 * freq / sampleRate);
        }

        return sineWaveArray;
    },

    playExistingSound: (sineWaveArray, sampleRate) => {
        //Tenemos en cuenta el volumen
        let volume = document.querySelector("#volumeInput").value
        for (i = 0; i < sineWaveArray.length; i++) {
            sineWaveArray[i] = sineWaveArray[i] * volume / 100
        }

        // We have to start with creating AudioContext
        const audioContext = new AudioContext({ sampleRate });

        // create audio buffer of the same length as our array
        const audioBuffer = audioContext.createBuffer(1, sineWaveArray.length, sampleRate);

        // this copies our sine wave to the audio buffer
        audioBuffer.copyToChannel(sineWaveArray, 0);

        // some JavaScript magic to actually play the sound
        const source = audioContext.createBufferSource(); 
        source.connect(audioContext.destination);
        source.buffer = audioBuffer;
        source.start();
    }
}