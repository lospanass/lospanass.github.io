let currentAudioIndex = 0;
let musicPlayed = false;

let numButtonClicks = 0;
let cps = 0;
let lastClickTime = 0;

let buddyCount = 0;
let lastBuddySoundIndex = -1;
let buddyPrice = 20;
let buddies = [];

let nudgeCost = 200;
let nudgeCPS = 5;
let nudgeCount = 0;
let nudges = [];

const music = new Audio("assets/sonido/music.mp3");

const numAudioClips = 10;
const audioPool = [];
const audioSource = document.getElementById("clickSound").src;

for (let i = 0; i < numAudioClips; i++) {
    audioPool.push(new Audio(audioSource));
}

function buttonClicked() {
    numButtonClicks++;
    updateBuddyButtonState();
    updateNudgeButtonState();

    let audio = audioPool[currentAudioIndex];
    audio.currentTime = 0;
    audio.play();

    currentAudioIndex = (currentAudioIndex + 1) % numAudioClips;

    let currentTime = Date.now();
    if (numButtonClicks > 1) {
        let timeDiff = currentTime - lastClickTime;
        cps = 1000 / timeDiff;
    }
    lastClickTime = currentTime;

    if (!musicPlayed) {
        music.volume = 0.5;
        music.play();
        music.loop = true;
        musicPlayed = true;
    }
}

function buyBuddy() {
    if (numButtonClicks >= buddyPrice) {
        numButtonClicks -= buddyPrice;
        buddyCount++;
        buddyPrice += 20;

        const buddyCountElement = document.getElementById("buddyCount");
        if (buddyCountElement) {
            buddyCountElement.textContent = "Tienes " + buddyCount + " Buddies actualmente.";
        }

        const buddyButton = document.querySelector(".buddyboton");
        if (buddyButton) {
            buddyButton.textContent = `Buddy - da 1 CPS (${buddyPrice} clicks)`;
        }

        buddies.push(Date.now());

        let randomSoundIndex;
        do {
            randomSoundIndex = Math.floor(Math.random() * 5);
        } while (randomSoundIndex === lastBuddySoundIndex);

        lastBuddySoundIndex = randomSoundIndex;

        const buddyPurchaseSound = new Audio(`assets/sonido/buddycute${randomSoundIndex + 1}.mp3`);
        buddyPurchaseSound.play();

        checkAchievements();
    }
    updateBuddyButtonState();
    updateNudgeButtonState();
}

function buyNudge() {
    if (numButtonClicks >= nudgeCost) {
        numButtonClicks -= nudgeCost;
        nudgeCount++;
        nudgeCost += 100;

        // Update UI elements
        const nudgeCountElement = document.getElementById("nudgeCount");
        if (nudgeCountElement) {
            nudgeCountElement.textContent = "Tienes " + nudgeCount + " Nudges actualmente.";
        }

        const nudgeButton = document.querySelector(".nudgeboton");
        if (nudgeButton) {
            nudgeButton.textContent = `Nudge - da 5 CPS (${nudgeCost} clicks)`;
            nudgeButton.style.opacity = 1; // Make button fully opaque
        }

        nudges.push(Date.now());

        // Update CPS to reflect nudge bonus
        cps += nudgeCPS;

        console.log("Nudge purchased! Current click count:", numButtonClicks);
        const nudgeSound = new Audio("assets/sonido/nudge.mp3");
        nudgeSound.play();

        // Shake the screen
        document.body.classList.add("shake");
        setTimeout(() => {
            document.body.classList.remove("shake");
        }, 500);
    } else {
        console.log("Not enough clicks to purchase a nudge. Current click count:", numButtonClicks);

        // Update button style to indicate it's not affordable
        const nudgeButton = document.querySelector(".nudgeboton");
        if (nudgeButton) {
            // ... (existing code for button style)
        }
    }

    updateBuddyButtonState();
    updateNudgeButtonState();
}

function updateBuddyButtonState() {
    const buddyButton = document.querySelector(".buddyboton");
    if (buddyButton) {
        buddyButton.style.backgroundImage = numButtonClicks >= buddyPrice ? "linear-gradient(#ffffff, #a5ffa9)" : "";
        buddyButton.style.color = numButtonClicks >= buddyPrice ? "#000000" : "#666";
        buddyButton.style.border = numButtonClicks >= buddyPrice ? "0.3rem double #00ffbb" : "0.3rem double #999";
        buddyButton.disabled = numButtonClicks < buddyPrice;
    }
}

function updateNudgeButtonState() {
    const nudgeButton = document.querySelector(".nudgeboton");
    if (nudgeButton) {
        nudgeButton.style.backgroundImage = numButtonClicks >= nudgeCost ? "linear-gradient(#ffffff, #a5ffa9)" : "";
        nudgeButton.style.color = numButtonClicks >= nudgeCost ? "#000000" : "#666";
        nudgeButton.style.border = numButtonClicks >= nudgeCost ? "0.3rem double #00ffbb" : "0.3rem double #999";
        nudgeButton.disabled = numButtonClicks < nudgeCost;
    }
}

let currentBuddyCPS = 0;

setInterval(() => {
    let currentBuddyCPS = 0;
    let currentNudgeCPS = 0;

    // Calculate Buddy CPS
    for (let i = 0; i < buddies.length; i++) {
        let timeSincePurchase = Date.now() - buddies[i];
        if (timeSincePurchase >= 1000) {
            currentBuddyCPS++;
            buddies[i] = Date.now();
        }
    }

    // Calculate Nudge CPS
    for (let i = 0; i < nudges.length; i++) {
        let timeSincePurchase = Date.now() - nudges[i];
        if (timeSincePurchase >= 1000) {
            currentNudgeCPS += 5; // Each nudge provides 5 CPS
            nudges[i] = Date.now();
        }
    }

    // Update total CPS
    cps = currentBuddyCPS + currentNudgeCPS;

    // Update click count
    numButtonClicks += cps;

    // Update UI
    updateBuddyButtonState();
    updateNudgeButtonState();

    const mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
        mainDiv.textContent = "Presionaste el botón " + Math.floor(numButtonClicks) + " veces";
    }
    const cpsDisplay = document.getElementById("cpsDisplay");
    if (cpsDisplay) {
        cpsDisplay.textContent = "CPS: " + cps.toFixed(2);
    }

    // Check achievements
    checkAchievements();
}, 100);

const achievements = [
    {
        id: "ACH_FIRST_BUDDY",
        name: "Primer Buddy",
        description: "Consigue tu primer Buddy.",
        unlocked: false,
        requirements: () => buddyCount >= 1
    },
    {
        id: "ACH_10_BUDDIES",
        name: "10 Buddies",
        description: "Consigue 10 Buddies.",
        unlocked: false,
        requirements: () => buddyCount >= 10
    },
    {
        id: "ACH_FIRST_NUDGE",
        name: "Primer Nudge",
        description: "Consigue tu primer Nudge.",
        unlocked: false,
        requirements: () => nudgeCount >= 1
    },
    {
        id: "ACH_1000_CLICKS",
        name: "Maestro de los Clicks",
        description: "Sí que puedes usar esa mano eh",
        unlocked: false,
        requirements: () => numButtonClicks >= 1000
    }
];

function checkAchievements() {
    achievements.forEach((achievement) => {
        const achievementElement = document.getElementById(achievement.id);
        if (achievementElement && !achievement.unlocked && achievement.requirements()) {
            achievement.unlocked = true;
            console.log(`Logro desbloqueado: ${achievement.name}`);
            achievementElement.classList.remove("locked");
            achievementElement.classList.add("unlocked");
        }
    });
}

function autoSave() {
    try {
        let buddiesTimestamps = [];

        if (buddies && Array.isArray(buddies)) {
            buddiesTimestamps = buddies
                .map((item) => {
                    if (item instanceof Date) {
                        return item.getTime();
                    } else if (typeof item === "number") {
                        return item;
                    } else {
                        console.error("Invalid item in buddies array:", item);
                        return null;
                    }
                })
                .filter((timestamp) => timestamp !== null);
        }

        let nudgesTimestamps = [];

        if (nudges && Array.isArray(nudges)) {
            nudgesTimestamps = nudges
                .map((item) => {
                    if (item instanceof Date) {
                        return item.getTime();
                    } else if (typeof item === "number") {
                        return item;
                    } else {
                        console.error("Invalid item in nudges array:", item);
                        return null;
                    }
                })
                .filter((timestamp) => timestamp !== null);
        }

        const gameData = {
            numButtonClicks: numButtonClicks,
            cps: cps,
            buddyCount: buddyCount,
            buddyPrice: buddyPrice,
            buddies: buddiesTimestamps,
            nudgeCount: nudgeCount,
            nudgeCost: nudgeCost,
            nudges: nudgesTimestamps
        };
        localStorage.setItem("guilleClickerSave", JSON.stringify(gameData));
        console.log("Game autosaved");
    } catch (error) {
        console.error("Error autosaving game:", error);
    }
}

function saveToBase64() {
    try {
        let buddiesTimestamps = [];

        if (buddies && Array.isArray(buddies)) {
            buddiesTimestamps = buddies
                .map((item) => {
                    if (item instanceof Date) {
                        return item.getTime();
                    } else if (typeof item === "number") {
                        return item;
                    } else {
                        console.error("Invalid item in buddies array:", item);
                        return null;
                    }
                })
                .filter((timestamp) => timestamp !== null);
        }

        let nudgesTimestamps = [];

        if (nudges && Array.isArray(nudges)) {
            nudgesTimestamps = nudges
                .map((item) => {
                    if (item instanceof Date) {
                        return item.getTime();
                    } else if (typeof item === "number") {
                        return item;
                    } else {
                        console.error("Invalid item in nudges array:", item);
                        return null;
                    }
                })
                .filter((timestamp) => timestamp !== null);
        }

        const gameData = {
            numButtonClicks: numButtonClicks,
            cps: cps,
            buddyCount: buddyCount,
            buddyPrice: buddyPrice,
            buddies: buddiesTimestamps,
            nudgeCount: nudgeCount,
            nudgeCost: nudgeCost,
            nudges: nudgesTimestamps
        };

        const gameDataString = JSON.stringify(gameData);
        const base64String = btoa(gameDataString);

        const saveArea = document.getElementById("saveArea");
        const saveOutput = document.getElementById("saveOutput");
        if (saveOutput && saveOutput.tagName === "TEXTAREA" && saveArea) {
            saveOutput.value = base64String;
            saveArea.style.display = "block";
            saveOutput.select();
            saveOutput.setSelectionRange(0, 99999);
        } else {
            console.error("saveOutput element not found or is not a textarea!");
            alert("Ni puta idea bro.");
            return;
        }

        console.log("Game saved (Base64):", base64String);
    } catch (error) {
        console.error("Error saving game:", error);
        alert("Error guardando");
    }
}

function loadFromBase64(savedData) {
    try {
        const base64String = savedData;
        if (base64String) {
            const gameDataString = atob(base64String);
            const gameData = JSON.parse(gameDataString);

            numButtonClicks = gameData.numButtonClicks;
            cps = gameData.cps;
            buddyCount = gameData.buddyCount;
            buddyPrice = gameData.buddyPrice;
            buddies = gameData.buddies ? gameData.buddies.map((timestamp) => new Date(parseInt(timestamp))) : [];
            nudgeCount = gameData.buddyCount;
            nudgeCost = gameData.buddyPrice;
            nudges = gameData.nudges ? gameData.nudges.map((timestamp) => new Date(parseInt(timestamp))) : [];

            const mainDiv = document.getElementById("mainDiv");
            if (mainDiv) {
                mainDiv.textContent = "Presionaste el botón " + Math.floor(numButtonClicks) + " veces";
            }
            const cpsDisplay = document.getElementById("cpsDisplay");
            if (cpsDisplay) {
                cpsDisplay.textContent = "CPS: " + cps.toFixed(2);
            }
            const buddyCountDisplay = document.getElementById("buddyCount");
            if (buddyCountDisplay) {
                buddyCountDisplay.textContent = "Tienes " + buddyCount + " Buddies actualmente.";
            }
            const buddyButton = document.querySelector(".buddyboton");
            if (buddyButton) {
                buddyButton.textContent = `Buddy - da 1 CPS (${buddyPrice} clicks)`;
                updateBuddyButtonState();
                updateNudgeButtonState();
                checkAchievements();
            }

            const nudgeCountDisplay = document.getElementById("nudgeCount");
            if (nudgeCountDisplay) {
                nudgeCountDisplay.textContent = "Tienes " + nudgeCount + " Nudges actualmente.";
            }
            const nudgeButton = document.querySelector(".buddyboton");
            if (nudgeButton) {
                nudgeButton.textContent = `Nudge - da 5 CPS (${nudgeCost} clicks)`;
                updateBuddyButtonState();
                updateNudgeButtonState();
                checkAchievements();
            }

            console.log("Game loaded:", gameData);
            alert("Partida cargada");
        }
    } catch (error) {
        console.error("Error loading game:", error);
        alert("Guardado corrupto");
    }
}

window.onload = function () {
    const savedData = prompt("Si tenés un texto de guardado, pegalo acá");
    if (savedData) {
        loadFromBase64(savedData);
    }
    setInterval(autoSave, 1000);
    updateBuddyButtonState();
    updateNudgeButtonState();

    const closeSaveButton = document.getElementById("closeSave");
    const saveArea = document.getElementById("saveArea");

    if (closeSaveButton && saveArea) {
        closeSaveButton.onclick = function () {
            saveArea.style.display = "none";
        };
    } else {
        console.error("Close button or save area not found!");
    }
};
