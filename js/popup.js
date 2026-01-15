document.addEventListener("DOMContentLoaded", function () {

  const openBtn = document.getElementById("openPopup");
  const popup = document.getElementById("popupOverlay");
  const closeBtn = document.getElementById("popupClose");

  if (!openBtn || !popup || !closeBtn) return;

  // Open popup
  openBtn.addEventListener("click", function (e) {
    e.preventDefault();
    popup.classList.add("show");
  });

  // Close popup on X
  closeBtn.addEventListener("click", function () {
    popup.classList.remove("show");
  });

  // Close when clicking outside
  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      popup.classList.remove("show");
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      popup.classList.remove("show");
    }
  });

});
