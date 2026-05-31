// Function to open the membership details modal and populate it with data from the JSON file

document.addEventListener('DOMContentLoaded', () => {
    
    async function openModal(level) {
        const modal = document.getElementById('membership-modal');
        const contentContainer = document.getElementById('modal-content');

        try {
            const response = await fetch('./data/membership.json');

            if (!response.ok) {
                throw new Error(`Failed to load JSON file: ${response.status}`);
            }

            const membershipData = await response.json();
            const data = membershipData[level];

            if (!data) {
                console.error(`Membership level "${level}" Not Found in JSON data.`);
                return;
            }

            const benefitsHTML = data.benefits
                .map(benefit => `<li>${benefit}</li>`)
                .join('');

            contentContainer.innerHTML = `
                <h2>${data.title}</h2>
                <p class="modal-cost"><strong>Investment:</strong> ${data.cost}</p>
                <h3>What's Included:</h3>
                <ul>
                    ${benefitsHTML}
                </ul>
            `;

            modal.showModal();

        } catch (error) {
            console.error('Error processing membership data:', error);
        }
    }

   
    const cardsGrid = document.querySelector('.cards-grid');

    
    if (cardsGrid) {
        cardsGrid.addEventListener('click', (event) => {
            
            const button = event.target.closest('.modal-link');

            if (button) {
                
                const membershipLevel = button.dataset.membership;

                
                openModal(membershipLevel);
            }
        });
    }
});



// Function to open the Thank You modal with form data

function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const contentContainer = document.getElementById('summary-content');

    if (!urlParams.has('firstName') && !urlParams.has('email')) {
        contentContainer.innerHTML = '<p style="color: #c0392b; font-weight: bold;">No application data found in the request.</p>';
        return;
    }

    const membershipLabels = {
        'np': 'NP Membership (Non-Profit - No Fee)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };

    const data = {
        'Applicant Name': `${urlParams.get('firstName') || ''} ${urlParams.get('lastName') || ''}`.trim(),
        'Organizational Title': urlParams.get('orgTitle') || 'Not provided',
        'Email Address': urlParams.get('email') || '',
        'Mobile Phone': urlParams.get('phone') || '',
        'Organization Name': urlParams.get('organization') || '',
        'Membership Level': membershipLabels[urlParams.get('membershipLevel')] || urlParams.get('membershipLevel') || '',
        'Description': urlParams.get('description') || 'Not provided',
        'Submission Time': urlParams.get('timestamp')
            ? new Date(parseInt(urlParams.get('timestamp'))).toLocaleString()
            : new Date().toLocaleString()
    };

    let htmlOutput = '';
    for (const [key, value] of Object.entries(data)) {
        htmlOutput += `
                    <div class="summary-item">
                        <span class="label">${key}</span>
                        <span class="value">${escapeHTML(value)}</span>
                    </div>
                `;
    }

    contentContainer.innerHTML = htmlOutput;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

document.addEventListener('DOMContentLoaded', displayFormData);