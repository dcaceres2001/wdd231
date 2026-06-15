// ============================================================
//  THE WOOD GUILD — render.js
//  ES Module: exports all render functions
// ============================================================

// ── Render project cards ─────────────────────────────────────
export function renderProjects(projects, projectsGrid, noResults) {
    projectsGrid.innerHTML = '';
    noResults.hidden = projects.length > 0;

    projects.forEach(project => {
        const card = document.createElement('article');
        card.classList.add('project-card');
        card.innerHTML = `
      <img src="${project.image}" alt="${project.alt}" loading="lazy" />
      <div class="card-body">
        <span class="tag">${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul class="card-meta">
          <li><span class="meta-label">Wood</span> ${project.wood}</li>
          <li><span class="meta-label">Finish</span> ${project.finish}</li>
          <li><span class="meta-label">Skill</span> ${project.skill}</li>
        </ul>
      </div>
    `;
        projectsGrid.appendChild(card);
    });
}

// ── Render tool cards ────────────────────────────────────────
export function renderTools(tools, toolsList, noResults) {
    toolsList.innerHTML = '';
    noResults.hidden = tools.length > 0;

    tools.forEach(tool => {
        const card = document.createElement('article');
        card.classList.add('tool-card');
        card.innerHTML = `
      <div class="tool-card-image">
        <img src="${tool.image}" alt="${tool.alt}" loading="lazy" />
      </div>
      <div class="tool-card-body">
        <div class="tool-card-header">
          <span class="tag">${tool.category}</span>
          <span class="skill-badge skill-${tool.skill.toLowerCase()}">${tool.skill}</span>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <ul class="card-meta">
          <li><span class="meta-label">Type</span> ${tool.type}</li>
          <li><span class="meta-label">Brand</span> ${tool.brand}</li>
          <li><span class="meta-label">Best For</span> ${tool.use}</li>
        </ul>
      </div>
    `;
        toolsList.appendChild(card);
    });
}

// ── Render shop cards ────────────────────────────────────────
export function renderShops(shops, shopsGrid, noResults, allShops, openModalFn) {
    shopsGrid.innerHTML = '';
    noResults.hidden = shops.length > 0;

    shops.forEach(shop => {
        const card = document.createElement('article');
        card.classList.add('shop-card');
        card.innerHTML = `
      <div class="shop-card-image">
        <img src="${shop.image}" alt="${shop.alt}" loading="lazy" />
      </div>
      <div class="shop-card-body">
        <div class="shop-card-header">
          <span class="tag tag-${shop.type}">${shop.type === 'local' ? 'Local' : 'Online'}</span>
          <span class="price-range">${shop.priceRange}</span>
        </div>
        <h3>${shop.name}</h3>
        <p class="shop-city">${shop.city}</p>
        <p class="shop-tagline">${shop.tagline}</p>
        <button class="guild-btn btn-filled shop-details-btn" data-id="${shop.id}">View Details</button>
      </div>
    `;
        shopsGrid.appendChild(card);
    });

    // Attach click events to detail buttons
    shopsGrid.querySelectorAll('.shop-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shop = allShops.find(s => s.id === parseInt(btn.dataset.id));
            if (shop) openModalFn(shop);
        });
    });
}
