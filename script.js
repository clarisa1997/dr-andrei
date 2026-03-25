const giftSection = document.getElementById("gift");
const confirmation = document.getElementById("confirmation");
const confettiContainer = document.getElementById("confetti");
const secretOverlay = document.getElementById("secret-overlay");
const confettiColors = ["#f9d265", "#ff8f3f", "#ffffff", "#d1ecff"];
let isRevealing = false;

function revealGift() {
  if (giftSection.classList.contains("hidden") && !isRevealing) {
    runSecretOverlay();
  } else {
    launchConfetti(20);
    giftSection.classList.add("revealed");
  }
}

function submitDate() {
  const dateValue = document.getElementById("date").value;
  confirmation.classList.remove("success", "error");

  if (!dateValue) {
    confirmation.innerText = "Seleziona prima la data perfetta 🗓️";
    confirmation.classList.add("error");
    return;
  }

  const formatted = new Date(dateValue).toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  confirmation.innerText = `Perfetto! Blocco il ${formatted} solo per noi ⚽`;
  confirmation.classList.add("success");
  launchConfetti(15);
}

function runSecretOverlay() {
  if (!secretOverlay) {
    showGiftSection();
    return;
  }

  isRevealing = true;
  secretOverlay.classList.remove("hidden");
  requestAnimationFrame(() => secretOverlay.classList.add("visible"));

  setTimeout(() => {
    secretOverlay.classList.remove("visible");
    setTimeout(() => {
      secretOverlay.classList.add("hidden");
      showGiftSection();
      isRevealing = false;
    }, 350);
  }, 1700);
}

function showGiftSection() {
  giftSection.classList.remove("hidden");
  requestAnimationFrame(() => giftSection.classList.add("revealed"));
  launchConfetti();
  setTimeout(() => {
    giftSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 400);
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
