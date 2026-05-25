const cards = document.querySelector('#cards');
const gridBtn = document.querySelector('#grid-btn');
const listBtn = document.querySelector('#list-btn');


const displayMembers = (members) => {
    cards.innerHTML = ""; 
    const fragment = document.createDocumentFragment();

    members.forEach(member => {
        let card = document.createElement('section');
        
       
        if (member.membership_level === 3) card.classList.add('gold-member');
        if (member.membership_level === 2) card.classList.add('silver-member');

       
        let companyImage = document.createElement('img');
        companyImage.src = `./images/${member.image_file_name}`;
        companyImage.alt = member.company_name;
        companyImage.loading = "lazy";
        card.appendChild(companyImage);
        companyImage.setAttribute("width", "200");
        companyImage.setAttribute("height", "120");

       
        let infoDiv = document.createElement('div');
        infoDiv.classList.add('card-info');

        let companyName = document.createElement('h2');
        let companyAddress = document.createElement('p');
        let companyPhone = document.createElement('p');
        let companyWebsite = document.createElement('a');
        let companyType = document.createElement('p');
        let companyMembership = document.createElement('p');

        companyName.textContent = member.company_name;
        companyAddress.textContent = member.company_addresses;
        companyPhone.textContent = member.company_phone_number;
        companyWebsite.textContent = member.company_website_url;
        companyWebsite.href = member.company_website_url;
        companyWebsite.target = "_blank";
        companyWebsite.rel = "noopener";
        companyType.textContent = member.business_type;
        
        const levels = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
        companyMembership.textContent = `Membership Level: ${levels[member.membership_level] || 'Standard'}`;

       
        infoDiv.appendChild(companyName);
        infoDiv.appendChild(companyAddress);
        infoDiv.appendChild(companyPhone);
        infoDiv.appendChild(companyWebsite);
        infoDiv.appendChild(companyType);
        infoDiv.appendChild(companyMembership);

       
        card.appendChild(infoDiv);

        fragment.appendChild(card);
    });
    cards.appendChild(fragment);
}

async function getMembers() {
    try {
        const response = await fetch('./data/members.json');
        const data = await response.json();
        displayMembers(data);

    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}


gridBtn.addEventListener('click', () => {
    cards.className = "grid-view"; 
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
    cards.className = "list-view"; 
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
});



getMembers();


