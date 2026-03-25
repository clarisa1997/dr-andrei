const views = {
  intro: document.getElementById("view-intro"),
  prank: document.getElementById("view-prank"),
  gift: document.getElementById("view-gift")
};
const confirmation = document.getElementById("confirmation");
const confettiContainer = document.getElementById("confetti");
const confettiColors = ["#f9d265", "#ff3b3b", "#ffffff", "#d1ecff"];
let audioCtx;

function switchView(target) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  const section = views[target];
  if (section) {
    section.classList.add("active");
  }
}

function revealGift() {
  switchView("prank");
}

function unveilRealGift() {
  switchView("gift");
  launchConfetti();
  playFanfare();
}

function submitDate() {
  const dateValue = document.getElementById("date").value;
  confirmation.classList.remove("success", "error");

  if (!dateValue) {
    confirmation.innerText = "Seleziona prima la data.";
    confirmation.classList.add("error");
    return;
  }

  const formatted = new Date(dateValue).toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  confirmation.innerText = `Perfetto: blocco il ${formatted} per te e il tuo ospite.`;
  confirmation.classList.add("success");
  launchConfetti(15);
}

function launchConfetti(amount = 40) {
  if (!confettiContainer) return;
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    const delay = Math.random() * 0.4;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.animationDelay = `${delay}s`;
    piece.style.transform = `translateY(-10vh) rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), 2800 + delay * 1000);
  }
}

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playFanfare() {
  ensureAudioContext();
  if (!audioCtx) return;

  const sequence = [
    { semitone: 0, duration: 0.3 },
    { semitone: 4, duration: 0.25 },
    { semitone: 7, duration: 0.45 },
    { semitone: 12, duration: 0.5 }
  ];

  let time = audioCtx.currentTime;
  sequence.forEach(({ semitone, duration }, idx) => {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = idx % 2 === 0 ? "sawtooth" : "triangle";
    oscillator.frequency.value = 440 * Math.pow(2, semitone / 12);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.5, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start(time);
    oscillator.stop(time + duration);
    time += duration * 0.7;
  });
}
