// ============================================================
//  THE WOOD GUILD — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  //  HAMBURGER MENU
  // ==========================================================
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggle && mobileNav) {
    mobileNav.style.display = 'none';

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.style.display === 'block' ? closeMenu() : openMenu();
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        closeMenu();
      }
    });

    function openMenu() {
      mobileNav.style.display = 'block';
      navToggle.setAttribute('aria-label', 'Close menu');
      navToggle.innerHTML = '&#10005;';
    }

    function closeMenu() {
      mobileNav.style.display = 'none';
      navToggle.setAttribute('aria-label', 'Open menu');
      navToggle.innerHTML = '&#9776;';
    }
  }

  // ==========================================================
  //  SHARED — Filter button logic
  // ==========================================================
  function initFilters(filterButtons, renderFn, allItems) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const result = filter === 'all'
          ? allItems
          : allItems.filter(item => item.category === filter || item.type === filter);
        renderFn(result);
      });
    });
  }

  // ==========================================================
  //  PROJECTS PAGE
  // ==========================================================
  const projectsGrid = document.getElementById('projects-grid');

  if (projectsGrid) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    let allProjects = [];

    fetch('data/projects.json')
      .then(res => res.json())
      .then(data => {
        allProjects = data;
        renderProjects(allProjects);
        initFilters(filterButtons, renderProjects, allProjects);
      })
      .catch(err => {
        projectsGrid.innerHTML = '<p>Sorry, projects could not be loaded.</p>';
        console.error('Error loading projects:', err);
      });

    function renderProjects(projects) {
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
  }

  // ==========================================================
  //  TOOLS PAGE
  // ==========================================================
  const toolsList = document.getElementById('tools-list');

  if (toolsList) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    let allTools = [];

    fetch('data/tools.json')
      .then(res => res.json())
      .then(data => {
        allTools = data;
        renderTools(allTools);
        initFilters(filterButtons, renderTools, allTools);
      })
      .catch(err => {
        toolsList.innerHTML = '<p>Sorry, tools could not be loaded.</p>';
        console.error('Error loading tools:', err);
      });

    function renderTools(tools) {
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
  }

  // ==========================================================
  //  SHOPS PAGE
  // ==========================================================
  const shopsGrid = document.getElementById('shops-grid');
  const modal = document.getElementById('shop-modal');

  if (shopsGrid && modal) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    let allShops = [];

    fetch('data/shops.json')
      .then(res => res.json())
      .then(data => {
        allShops = data;
        renderShops(allShops);
        initFilters(filterButtons, renderShops, allShops);
      })
      .catch(err => {
        shopsGrid.innerHTML = '<p>Sorry, shops could not be loaded.</p>';
        console.error('Error loading shops:', err);
      });

    // ── Render shop cards ────────────────────────────
    function renderShops(shops) {
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

      // Attach click events to all detail buttons
      document.querySelectorAll('.shop-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const shop = allShops.find(s => s.id === parseInt(btn.dataset.id));
          if (shop) openModal(shop);
        });
      });
    }

    // ── Open modal ───────────────────────────────────
    function openModal(shop) {
      document.getElementById('modal-img').src = shop.image;
      document.getElementById('modal-img').alt = shop.alt;
      document.getElementById('modal-type').textContent = shop.type === 'local' ? 'Local' : 'Online';
      document.getElementById('modal-type').className = `tag tag-${shop.type}`;
      document.getElementById('modal-price').textContent = shop.priceRange;
      document.getElementById('modal-title').textContent = shop.name;
      document.getElementById('modal-city').textContent = shop.city;
      document.getElementById('modal-description').textContent = shop.description;
      document.getElementById('modal-hours').textContent = shop.hours;
      document.getElementById('modal-tip').textContent = shop.memberTip;
      document.getElementById('modal-visit-btn').href = shop.website;
      document.getElementById('modal-map-btn').href = shop.mapsUrl;


      const specList = document.getElementById('modal-specialties');
      specList.innerHTML = shop.specialties
        .map(s => `<li><span class="specialty-tag">${s}</span></li>`)
        .join('');


      const mapBtn = document.getElementById('modal-map-btn');
      mapBtn.style.display = shop.type === 'local' ? 'inline-block' : 'none';

      modal.hidden = false;
      document.body.classList.add('modal-open');


      modal.querySelector('.modal-close').focus();
    }

    // ── Close modal ──────────────────────────────────
    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    }

    // Close on X button
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    // Close on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  // ==========================================================
  //  ABOUT PAGE — Join form validation
  // ==========================================================
  const joinForm = document.getElementById('join-form');

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      function setError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (message) {
          field.classList.add('invalid');
          error.textContent = message;
          valid = false;
        } else {
          field.classList.remove('invalid');
          error.textContent = '';
        }
      }

      const name = document.getElementById('name').value.trim();
      setError('name', 'name-error', name ? '' : 'Please enter your name.');

      const email = document.getElementById('email').value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setError('email', 'email-error', 'Please enter your email address.');
      } else if (!emailPattern.test(email)) {
        setError('email', 'email-error', 'Please enter a valid email address.');
      } else {
        setError('email', 'email-error', '');
      }

      const skill = document.getElementById('skill').value;
      setError('skill', 'skill-error', skill ? '' : 'Please select your skill level.');

      if (valid) {
        joinForm.reset();
        const success = document.getElementById('form-success');
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    ['name', 'email', 'skill'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        document.getElementById(id).classList.remove('invalid');
        document.getElementById(`${id}-error`).textContent = '';
      });
    });
  }

}); 
