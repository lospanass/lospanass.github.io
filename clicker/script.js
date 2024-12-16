// script.js
let numButtonClicks = 0;
let cps = 0;
let lastClickTime = 0;
const numAudioClips = 10; // Number of audio clips in the pool
const audioPool = [];
const audioSource = document.getElementById('clickSound').src;

// Create the audio pool
for (let i = 0; i < numAudioClips; i++) {
    audioPool.push(new Audio(audioSource));
}

let currentAudioIndex = 0;

function buttonClicked() {
    numButtonClicks++;
    document.getElementById("mainDiv").textContent = "presionaste el boton " + numButtonClicks + " veces";

    let audio = audioPool[currentAudioIndex];
    audio.currentTime = 0; // Reset playback to the beginning
    audio.play();

    currentAudioIndex = (currentAudioIndex + 1) % numAudioClips; // Cycle through the pool

    let currentTime = Date.now();
    if (lastClickTime !== 0) {
        let timeDiff = currentTime - lastClickTime;
        cps = 1000 / timeDiff; // Calculate clicks per second
        document.getElementById("cpsDisplay").textContent = "CPS: " + cps.toFixed(2); // Display CPS with 2 decimal places
    }
    lastClickTime = currentTime;
}

setInterval(() => {
    if (cps > 0) {
        cps = cps * 0.9;
        document.getElementById("cpsDisplay").textContent = "CPS: " + cps.toFixed(2);
    }
}, 1000);