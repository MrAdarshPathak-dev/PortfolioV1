// Tells the CSS that JavaScript is running (so reveal animations only hide content when JS works)
document.documentElement.classList.add("js");

/* ===== 1. MOBILE MENU ===== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after clicking a link (smooth scrolling itself is handled in CSS)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ===== 2. NAVBAR SHADOW ON SCROLL (small interactive effect) ===== */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

/* ===== 3. ACTIVE NAV LINK ===== */
// Highlights the link of the section currently on screen
const sections = document.querySelectorAll("main section[id]");
const linkEls = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        linkEls.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" } // triggers when a section reaches the middle of the screen
);
sections.forEach((section) => navObserver.observe(section));

/* ===== 4. SCROLL REVEAL ===== */
// Any element with class "reveal" fades in once when it scrolls into view
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ===== 5. CONTACT FORM (UI only, no backend) ===== */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

// Show or clear an error message under a field
function setError(fieldId, message) {
  document.getElementById(fieldId + "Error").textContent = message;
  document.getElementById(fieldId).closest(".field").classList.toggle("invalid", message !== "");
}

// Returns true if everything is valid
function validateForm() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

  setError("name", name.length < 2 ? "Please enter your name." : "");
  setError("email", !emailPattern.test(email) ? "Please enter a valid email address." : "");
  setError("message", message.length < 10 ? "Please write at least 10 characters." : "");

  if (name.length < 2 || !emailPattern.test(email) || message.length < 10) valid = false;
  return valid;
}

// TODO (backend): replace the body of this function with a real request,
// e.g. fetch("YOUR_FORM_ENDPOINT", { method: "POST", body: JSON.stringify(data) })
// Services like Formspree or EmailJS work without writing your own server.
function sendMessage(data) {
  console.log("Form data (not sent anywhere yet):", data);
  return Promise.resolve(); // pretend it succeeded
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  statusEl.textContent = "";
  if (!validateForm()) return;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  sendMessage(data).then(() => {
    statusEl.textContent = "Thanks! The form is not connected to a backend yet, so nothing was sent.";
    form.reset();
  });
});