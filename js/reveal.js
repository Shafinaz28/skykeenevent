document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".reveal");

  const reveal = () => {
    const winH = window.innerHeight;
    items.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < winH - 120) el.classList.add("active");
    });
  };

  window.addEventListener("scroll", reveal);
  reveal();
});
