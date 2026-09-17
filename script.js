const screens = [...document.querySelectorAll(".screen")];
const startButton = document.querySelector("#startButton");
const heartButton = document.querySelector("#heartButton");
const heartInstruction = document.querySelector("#heartInstruction");
const heartParticles = document.querySelector("#heartParticles");
const progressFill = document.querySelector("#progressFill");
const progressLabel = document.querySelector("#progressLabel");
const envelopeButton = document.querySelector("#envelopeButton");
const replayButton = document.querySelector("#replayButton");
const confetti = document.querySelector("#confetti");

const heartPhrases = [
  "Apretá el corazón",
  "Una vez más…",
  "Eso es ♡",
  "Seguí, seguí…",
  "Un poquito más",
  "Cada vez más cerquita",
  "Solo un poco más…",
  "Ya casi llegamos",
  "Uno de los últimos…",
  "Este es el último ♡",
  "Ahora sí…",
];

let heartClicks = 0;
let isTransitioning = false;

function showScreen(name) {
  if (isTransitioning) return;

  const current = document.querySelector(".screen.is-active");
  const next = document.querySelector(`[data-screen="${name}"]`);
  if (!next || current === next) return;

  isTransitioning = true;
  current?.classList.add("is-leaving");
  next.classList.add("is-active");
  next.setAttribute("aria-hidden", "false");
  next.scrollTop = 0;

  window.setTimeout(() => {
    current?.classList.remove("is-active", "is-leaving");
    current?.setAttribute("aria-hidden", "true");
    isTransitioning = false;
  }, 680);
}

function changeHeartPhrase(phrase) {
  heartInstruction.classList.add("is-changing");
  window.setTimeout(() => {
    heartInstruction.textContent = phrase;
    heartInstruction.classList.remove("is-changing");
  }, 170);
}

function makeHeartParticles() {
  const amount = heartClicks === 10 ? 16 : 7;

  for (let index = 0; index < amount; index += 1) {
    const particle = document.createElement("span");
    const angle = (360 / amount) * index + (Math.random() * 18 - 9);
    particle.className = "particle";
    particle.textContent = index % 3 === 0 ? "✦" : "♥";
    particle.style.setProperty("--angle", `${angle}deg`);
    particle.style.setProperty("--distance", `${64 + Math.random() * 55}px`);
    particle.style.fontSize = `${0.65 + Math.random() * 0.7}rem`;
    heartParticles.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function createConfetti() {
  confetti.replaceChildren();
  const colors = ["#a64748", "#d68c65", "#d2aa65", "#6d9b8e", "#8f789f"];

  for (let index = 0; index < 72; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--x", `${Math.random() * 100 - 50}px`);
    piece.style.setProperty("--rotation", `${400 + Math.random() * 700}deg`);
    piece.style.setProperty("--duration", `${2.4 + Math.random() * 2.1}s`);
    piece.style.setProperty("--delay", `${Math.random() * 1.2}s`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    piece.style.width = `${5 + Math.random() * 6}px`;
    piece.style.height = `${8 + Math.random() * 9}px`;
    confetti.appendChild(piece);
  }
}

startButton.addEventListener("click", () => {
  showScreen("heart");
  window.setTimeout(() => heartButton.focus({ preventScroll: true }), 720);
});

heartButton.addEventListener("click", () => {
  if (heartClicks >= 10 || isTransitioning) return;

  heartClicks += 1;
  const percentage = heartClicks * 10;
  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${percentage}%`;
  changeHeartPhrase(heartPhrases[heartClicks]);
  makeHeartParticles();

  heartButton.classList.remove("is-pulsing");
  void heartButton.offsetWidth;
  heartButton.classList.add("is-pulsing");

  if (heartClicks === 10) {
    heartButton.disabled = true;
    window.setTimeout(() => showScreen("memory"), 1050);
  }
});

envelopeButton.addEventListener("click", () => {
  showScreen("letter");
  window.setTimeout(createConfetti, 360);
});

replayButton.addEventListener("click", () => {
  heartClicks = 0;
  heartButton.disabled = false;
  progressFill.style.width = "0%";
  progressLabel.textContent = "0%";
  heartInstruction.textContent = heartPhrases[0];
  confetti.replaceChildren();
  showScreen("cover");
});

screens.forEach((screen) => {
  screen.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && screen.dataset.screen !== "cover") {
      showScreen("cover");
    }
  });
});
