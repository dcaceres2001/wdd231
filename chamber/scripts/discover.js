import { volcanoes } from '../data/volcanoes.mjs';


const galleryContainer = document.getElementById('volcanoes-gallery');


const cardMarkup = volcanoes.map((volcano, index) => {

    
    const isPriorityImage = index < 2;
    const fetchPriorityAttr = isPriorityImage ? 'fetchpriority="high"' : '';
    const loadingAttr = isPriorityImage ? '' : 'loading="lazy"';

    
    return `
        <article class="volcano-card">
            <h2>${volcano.name}</h2>
            <figure class="volcano-figure">
                <img src="${volcano.image}" 
                     alt="Scenic view of ${volcano.name}" 
                     class="volcano-img" 
                     width="400" 
                     height="225" 
                     sizes="(max-width: 400px) 100vw, 400px"
                     ${loadingAttr} 
                     ${fetchPriorityAttr}>
            </figure>
            <address class="volcano-address">
                📍 ${volcano.address}
            </address>
            <p class="volcano-desc">
                ${volcano.description}
            </p>
            <button class="volcano-btn" data-id="${volcano.id}">Learn More</button>
        </article>
    `;
}).join(''); 
if (galleryContainer) {
    galleryContainer.innerHTML = cardMarkup;
}




const modal = document.getElementById('volcano-modal');
const modalTitle = document.getElementById('modal-title');
const modalDetails = document.getElementById('modal-details');
const closeModalBtn = document.getElementById('close-modal');


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('volcano-btn')) {
        const volcanoId = parseInt(e.target.getAttribute('data-id'));

        
        const volcano = volcanoes.find(v => v.id === volcanoId);

        if (volcano && modal && modalTitle && modalDetails) {
            modalTitle.textContent = volcano.name;
            modalDetails.textContent = volcano.details;
            modal.style.display = 'flex'; 
        }
    }
});


if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}


window.addEventListener('click', (e) => {
    if (modal && e.target === modal) {
        modal.style.display = 'none';
    }
});

