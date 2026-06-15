// ============================================================
//  THE WOOD GUILD — thankyou.js
//  Reads URL search params and displays them on the thank you page
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);

    const summaryNameEl = document.getElementById('summary-name');
    const summaryEmailEl = document.getElementById('summary-email');
    const summarySkillEl = document.getElementById('summary-skill');
    const summaryInterestEl = document.getElementById('summary-interest');

    if (summaryNameEl) summaryNameEl.textContent = params.get('name') || 'Not provided';
    if (summaryEmailEl) summaryEmailEl.textContent = params.get('email') || 'Not provided';
    if (summarySkillEl) summarySkillEl.textContent = params.get('skill') || 'Not provided';
    if (summaryInterestEl) summaryInterestEl.textContent = params.get('interest') || 'Not provided';

});

