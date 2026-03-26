const views = {
  intro: document.getElementById("view-intro"),
  bridge: document.getElementById("view-bridge"),
  prank: document.getElementById("view-prank"),
  gift: document.getElementById("view-gift"),
  celebration: document.getElementById("view-celebration")
};
const confirmation = document.getElementById("confirmation");
const confettiContainer = document.getElementById("confetti");
const heartsContainer = document.getElementById("hearts");
const confettiColors = ["#f9d265", "#ff3b3b", "#ffffff", "#d1ecff"];
const heartColors = ["#ffffff", "#000000"];
let audioCtx;
let heartsUnlocked = false;
let feedbackRating = null;
let feedbackChoice = null;
let clickWarningArmed = false;
const ratingButtons = document.querySelectorAll(".rating-star");
const feedbackError = document.getElementById("feedback-error");
const feedbackRadios = document.querySelectorAll('input[name="feedback-choice"]');
const clickWarning = document.getElementById("click-warning");
const helpPopover = document.getElementById("help-popover");

ratingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = Number(button.dataset.value);
    feedbackRating = value;
    highlightStars(feedbackRating);
  });
  button.addEventListener("mouseenter", () => highlightStars(Number(button.dataset.value)));
  button.addEventListener("mouseleave", () => highlightStars(feedbackRating));
});

function highlightStars(value) {
  ratingButtons.forEach((star) => {
    const starValue = Number(star.dataset.value);
    const isActive = value && starValue <= value;
    star.classList.toggle("selected", Boolean(isActive));
    star.setAttribute("aria-pressed", isActive ? "true" : "false");
    star.textContent = isActive ? "★" : "☆";
  });
}

highlightStars(0);

feedbackRadios.forEach((radio) => {
  radio.addEventListener("change", (event) => {
    feedbackChoice = event.target.value;
    document.querySelectorAll(".feedback-option").forEach((option) =>
      option.classList.remove("selected")
    );
    const option = event.target.closest(".feedback-option");
    if (option) option.classList.add("selected");
  });
});

function submitFeedback() {
  if (feedbackRating === null || !feedbackChoice) {
    if (feedbackError) {
      feedbackError.innerText = "Ehi ehi ehi, ti sei dimenticato qualcosa: voto e risposta prima di proseguire.";
    }
    return;
  }
  if (feedbackError) {
    feedbackError.innerText = "";
  }
  switchView("bridge");
}

function switchView(target) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  const section = views[target];
  if (section) {
    section.classList.add("active");
  }
  if (target === "bridge") {
    setTimeout(() => armClickWarning(), 120);
  } else {
    disarmClickWarning();
  }
}

function showPrank() {
  switchView("prank");
  launchConfetti(35);
  disarmClickWarning();
  if (helpPopover) {
    helpPopover.classList.add("hidden");
  }
}

function unveilRealGift() {
  switchView("gift");
  heartsUnlocked = true;
  launchHearts(40);
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
  launchHearts(20);
  switchView("celebration");
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

function launchHearts(amount = 30) {
  if (!heartsContainer) return;
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    const delay = Math.random() * 0.5;
    heart.className = "heart";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.background = heartColors[Math.floor(Math.random() * heartColors.length)];
    heart.style.animationDelay = `${delay}s`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 3500 + delay * 1000);
  }
}

document.addEventListener("click", () => {
  if (heartsUnlocked) {
    launchHearts(8);
  }
});

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

function showClickWarning(event) {
  const bridgeView = views.bridge;
  if (!bridgeView || !bridgeView.classList.contains("active") || !clickWarningArmed) return;
  const target = event.target;
  if (target.closest(".bonus-cta button") || target.closest(".help-icon")) return;
  if (clickWarning) {
    clickWarning.classList.remove("hidden");
  }
}

document.addEventListener("click", showClickWarning);

function armClickWarning() {
  clickWarningArmed = true;
  if (clickWarning) {
    clickWarning.classList.add("hidden");
  }
}

function disarmClickWarning() {
  clickWarningArmed = false;
  if (clickWarning) {
    clickWarning.classList.add("hidden");
  }
}

function toggleHelp() {
  if (!views.bridge || !views.bridge.classList.contains("active") || !helpPopover) return;
  helpPopover.classList.toggle("hidden");
}
