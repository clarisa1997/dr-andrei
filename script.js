function revealGift() {
  document.getElementById("gift").classList.remove("hidden");
}

function submitDate() {
  const date = document.getElementById("date").value;
  const confirmation = document.getElementById("confirmation");

  if (!date) {
    confirmation.innerText = "Seleziona una data prima!";
    return;
  }

  confirmation.innerText = `Perfetto! Hai scelto il ${date} ⚽`;
}