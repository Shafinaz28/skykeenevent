document.addEventListener("DOMContentLoaded", async () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  const headerPath = "../components/header.html";
  const footerPath = "../components/footer.html";

  // Load Header
  try {
    const res = await fetch(headerPath);
    if (!res.ok) throw new Error("Header not found: " + res.status);
    headerEl.innerHTML = await res.text();

    // Grab elements AFTER header is injected
    const hamburger = document.getElementById("hamburgerBtn");
    const nav = document.getElementById("navMenu");
    const overlay = document.getElementById("navOverlay"); // optional
    const closeBtn =
      document.getElementById("closeMenu") || nav?.querySelector(".close-btn"); // ✅ works both ways

    // Safety checks
    if (!hamburger || !nav) {
      console.error("Missing #hamburgerBtn or #navMenu in header.html");
      return;
    }

    function openNav() {
      nav.classList.add("show");
      overlay?.classList.add("show");
      hamburger.style.visibility = "hidden";
    }

    function closeNav() {
      nav.classList.remove("show");
      overlay?.classList.remove("show");
      hamburger.style.visibility = "visible";
    }

    // Toggle menu
    hamburger.addEventListener("click", () => {
      nav.classList.contains("show") ? closeNav() : openNav();
    });

    // Close actions
    closeBtn?.addEventListener("click", closeNav);
    overlay?.addEventListener("click", closeNav);

    // Close on link click
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));

    // ESC close (optional)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

  } catch (e) {
    console.error("HEADER LOAD ERROR:", e);
  }

  // Load Footer
  try {
    const res = await fetch(footerPath);
    if (!res.ok) throw new Error("Footer not found: " + res.status);
    footerEl.innerHTML = await res.text();
  } catch (e) {
    console.error("FOOTER LOAD ERROR:", e);
  }
});

