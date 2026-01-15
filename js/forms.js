// ✅ Paste your Google Apps Script Web App URL here
const SCRIPT_URL = "PASTE_YOUR_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".js-sheet-form");

  forms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const statusEl = form.querySelector(".form-status");
      if (statusEl) statusEl.textContent = "Submitting...";

      const data = new FormData(form);
      data.append("timestamp", new Date().toISOString());

      try {
        await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: data
        });

        form.reset();
        if (statusEl) statusEl.textContent = "✅ Submitted successfully!";
      } catch (err) {
        if (statusEl) statusEl.textContent = "❌ Failed. Try again.";
      }
    });
  });
});
