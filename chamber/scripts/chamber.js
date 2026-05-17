// Navigation menu toggle
const navButton = document.querySelector('#ham-btn');
const navLinks = document.querySelector('#nav-bar');

// Event listener for navigation toggle

navButton.addEventListener('click', () => {
    navButton.classList.toggle('show');
    navLinks.classList.toggle('show');
});

// Close the menu when a link is clicked (for better mobile experience)
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Display last modified date

const lastModified = document.lastModified;
document.getElementById("lastModified").textContent = `Last modified: ${lastModified}`;

