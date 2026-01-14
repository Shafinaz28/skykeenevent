function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById(id);
      container.innerHTML = data;

      // Find the menu and hamburger INSIDE the loaded header
      const navMenu = container.querySelector("#navMenu");
      const hamburger = container.querySelector(".hamburger");

      // Check if they exist (prevents errors on Footer)
      if (hamburger && navMenu) {
        
        // --- TOGGLE CLICK EVENT ---
        hamburger.onclick = () => {
          // 1. Toggle the 'show' class to Open/Close menu
          navMenu.classList.toggle("show");

          // 2. Swap the Icon: If open show '✕', else show '☰'
          if (navMenu.classList.contains("show")) {
            hamburger.innerHTML = "&#10005;"; // This is the HTML code for 'X'
          } else {
            hamburger.innerHTML = "&#9776;";  // This is the HTML code for '☰'
          }
        };

        // --- CLOSE ON LINK CLICK ---
        // (Optional) Close the menu automatically when a user clicks a link
        navMenu.querySelectorAll("a").forEach(link => {
          link.onclick = () => {
            navMenu.classList.remove("show");
            hamburger.innerHTML = "&#9776;"; // Reset icon back to lines
          };
        });
      }
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}
// Load your components
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");

// service model

function openModal(imageSrc, titleText, descText) {
  var modal = document.getElementById("serviceModal");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  var descElement = document.getElementById("description");

  // 1. Show the modal
  modal.style.display = "flex";
  
  // 2. Set the Image Source
  modalImg.src = imageSrc;
  
  // 3. Set the Text content
  captionText.innerHTML = titleText;
  descElement.innerHTML = descText;
}

function closeModal() {
  var modal = document.getElementById("serviceModal");
  // Hide the modal
  modal.style.display = "none";
}

// Optional: Close modal if user clicks anywhere outside the image
window.onclick = function(event) {
  var modal = document.getElementById("serviceModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}