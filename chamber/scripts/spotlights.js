const jsonUrl = 'data/members.json';

async function getMembers() {
    try {
        const response = await fetch(jsonUrl);
        if (response.ok) {
            
            const membersList = await response.json();
            displaySpotlights(membersList);
        } else {
            throw Error("members file could not be found");
        }
    } catch (error) {
        console.error("error processing members file:", error);
    }
}

function displaySpotlights(membersList) {
    const container = document.getElementById('spotlight-container');
    if (!container) return; 
    container.innerHTML = "";

    
    const premiumMembers = membersList.filter(member =>
        member.membership_level === 3 || member.membership_level === 2
    );

    
    for (let i = premiumMembers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [premiumMembers[i], premiumMembers[j]] = [premiumMembers[j], premiumMembers[i]];
    }

    
   
    const selectedSpotlights = premiumMembers.slice(0, 3);

   
    selectedSpotlights.forEach(company => {
        const card = document.createElement('div');
        card.classList.add('spotlight-card');

        
        const levelText = company.membership_level === 3 ? 'Gold' : 'Silver';

        card.innerHTML = `
            <h3>${company.company_name}</h3>
            <img src="images/${company.image_file_name}" alt="${company.company_name} Logo" loading="lazy" width="150" height="75">
            <p class="tagline">"${company.visitor_perk}"</p>
            <hr>
            <p><strong>Phone:</strong> ${company.company_phone_number}</p>
            <p><strong>Type:</strong> ${company.business_type}</p>
            <p><strong>Level:</strong> ${levelText}</p>
            <a href="${company.company_website_url}" target="_blank" rel="noopener">Visit Website</a>
        `;
        container.appendChild(card);
    });
}


getMembers();