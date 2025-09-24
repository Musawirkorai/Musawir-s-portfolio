function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
const blogCards = document.querySelectorAll(".blog-card");

blogCards.forEach(card => {
  card.addEventListener("click", () => {
    // If the clicked blog is already active → close it
    if (card.classList.contains("active")) {
      card.classList.remove("active");
    } else {
      // Close all blogs first
      blogCards.forEach(c => c.classList.remove("active"));
      // Open clicked blog
      card.classList.add("active");
    }
  });
});
