let numButtonClicks = 0;
let cps = 0;
let lastClickTime = 0;
let buddyCount = 0;
let buddyPrice = 20;
let buddies = [];
let currentAudioIndex = 0;
let musicPlayed = false;
const music = new Audio("assets/sonido/music.mp3");

const numAudioClips = 10;
const audioPool = [];
const audioSource = document.getElementById("clickSound").src;

for (let i = 0; i < numAudioClips; i++) {
    audioPool.push(new Audio(audioSource));
}

function buttonClicked() {
    numButtonClicks++;
    document.getElementById("mainDiv").textContent = "presionaste el boton " + numButtonClicks + " veces";

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
        numButtonClicks -= buddyPrice; // Deduct clicks FIRST
        buddyCount++; // Increment buddy count SECOND
        buddyPrice += 20;

        document.getElementById("buddyCount").textContent = "Buddies: " + buddyCount;
        document.querySelector(".buddyboton").textContent = `Buddy - da 1 CPS (${buddyPrice} clicks)`;

        buddies.push(Date.now());

        const randomSoundIndex = Math.floor(Math.random() * 5);
        const buddyPurchaseSound = new Audio(`assets/sonido/buddycute${randomSoundIndex + 1}.mp3`);
        buddyPurchaseSound.play();

        checkAchievements(); // Call checkAchievements() AFTER incrementing buddyCount
    }
}

setInterval(() => {
    if (cps > 0) {
        cps = cps * 0.9;
    }

    let currentBuddyCPS = 0;
    for (let i = 0; i < buddies.length; i++) {
        let timeSincePurchase = Date.now() - buddies[i];

        if (timeSincePurchase >= 1000) {
            currentBuddyCPS++;
            buddies[i] = Date.now(); // Update the purchase time for this specific buddy
        }
    }

    cps += currentBuddyCPS;
    numButtonClicks += buddyCount;
    document.getElementById("mainDiv").textContent = "presionaste el boton " + numButtonClicks + " veces";
    document.getElementById("cpsDisplay").textContent = "CPS: " + cps.toFixed(2);
    checkAchievements();
}, 1000);

const achievements = [
    {
        id: "ACH_FIRST_BUDDY",
        name: "Primer Buddy",
        description: "Consigue tu primer Buddy.",
        unlocked: false,
        requirements: () => buddyCount >= 1
    },
    {
        id: "ACH_1000_CLICKS",
        name: "Maestro de los Clicks",
        description: "Sí que puedes usar esa mano eh",
        unlocked: false,
        requirements: () => numButtonClicks >= 1000
    }
    // Add more achievements here
];

function checkAchievements() {
    achievements.forEach((achievement) => {
        const achievementElement = document.getElementById(`${achievement.id}`); // Corrected line
        if (!achievement.unlocked && achievement.requirements()) {
            achievement.unlocked = true;
            console.log(`Logro desbloqueado: ${achievement.name}`);

            if (achievementElement) {
                achievementElement.classList.remove("locked");
                achievementElement.classList.add("unlocked");
            }
        }
    });
}
