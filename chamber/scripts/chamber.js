
const navButton = document.querySelector('#ham-btn');
const navLinks = document.querySelector('#nav-bar');



navButton.addEventListener('click', () => {
    navButton.classList.toggle('show');
    navLinks.classList.toggle('show');
});


document.getElementById("currentYear").textContent = new Date().getFullYear();



const lastModified = document.lastModified;
document.getElementById("lastModified").textContent = `Last modified: ${lastModified}`;



// last visit message
const visitMessageElement = document.getElementById('visit-message');

function handleVisitMessage() {
    
    if (!visitMessageElement) return;

    const currentTimestamp = Date.now();
    const lastVisit = localStorage.getItem('last-visit');

    if (!lastVisit) {
        visitMessageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentTimestamp - parseInt(lastVisit);
        const daysSinceLastVisit = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysSinceLastVisit < 1) {
            visitMessageElement.textContent = "Back so soon? Awesome!";
        } else {
            const dayText = daysSinceLastVisit === 1 ? "day" : "days";
            visitMessageElement.textContent = `You last visited ${daysSinceLastVisit} ${dayText} ago.`;
        }
    }

    localStorage.setItem('last-visit', currentTimestamp);
}

handleVisitMessage();

