// ============================================================
//  THE WOOD GUILD — script.js
//  ES Module: imports render functions from render.js
// ============================================================

import { renderProjects, renderTools, renderShops } from './render.js';

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
  //  SHARED — Filter button logic with localStorage
  //  storageKey: unique key per page so projects and tools
  //  filters are stored independently
  // ==========================================================
  function initFilters(filterButtons, renderFn, allItems, storageKey) {

    // Read the saved filter from localStorage, default to 'all'
    const savedFilter = localStorage.getItem(storageKey) || 'all';

    // Apply the saved filter on page load
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === savedFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Render with the saved filter immediately
    const savedResult = savedFilter === 'all'
      ? allItems
      : allItems.filter(item => item.category === savedFilter || item.type === savedFilter);
    renderFn(savedResult);

    // Attach click events
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Save selected filter to localStorage
        localStorage.setItem(storageKey, filter);

        const result = filter === 'all'
          ? allItems
          : allItems.filter(item => item.category === filter || item.type === filter);
        renderFn(result);
      });
    });
  }

  // ==========================================================
  //  PROJECTS PAGE — async/await with try/catch
  // ==========================================================
  const projectsGrid = document.getElementById('projects-grid');

  if (projectsGrid) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    let allProjects = [];

    async function loadProjects() {
      try {
        const res = await fetch('data/projects.json');
        const data = await res.json();
        allProjects = data;

        // Pass 'guild_projects_filter' as the localStorage key
        initFilters(filterButtons, (filtered) => {
          renderProjects(filtered, projectsGrid, noResults);
        }, allProjects, 'guild_projects_filter');

      } catch (err) {
        projectsGrid.innerHTML = '<p>Sorry, projects could not be loaded.</p>';
        console.error('Error loading projects:', err);
      }
    }

    loadProjects();
  }

  // ==========================================================
  //  TOOLS PAGE — async/await with try/catch
  // ==========================================================
  const toolsList = document.getElementById('tools-list');

  if (toolsList) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    let allTools = [];

    async function loadTools() {
      try {
        const res = await fetch('data/tools.json');
        const data = await res.json();
        allTools = data;

        // Pass 'guild_tools_filter' as the localStorage key
        initFilters(filterButtons, (filtered) => {
          renderTools(filtered, toolsList, noResults);
        }, allTools, 'guild_tools_filter');

      } catch (err) {
        toolsList.innerHTML = '<p>Sorry, tools could not be loaded.</p>';
        console.error('Error loading tools:', err);
      }
    }

    loadTools();
  }

  // ==========================================================
  //  SHOPS PAGE — async/await with try/catch
  // ==========================================================
  const shopsGrid = document.getElementById('shops-grid');
  const modal = document.getElementById('shop-modal');

  if (shopsGrid && modal) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('no-results');
    let allShops = [];

    async function loadShops() {
      try {
        const res = await fetch('data/shops.json');
        const data = await res.json();
        allShops = data;
        renderShops(allShops, shopsGrid, noResults, allShops, openModal);
        initFilters(filterButtons, (filtered) => {
          renderShops(filtered, shopsGrid, noResults, allShops, openModal);
        }, allShops, 'guild_shops_filter');
      } catch (err) {
        shopsGrid.innerHTML = '<p>Sorry, shops could not be loaded.</p>';
        console.error('Error loading shops:', err);
      }
    }

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

    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    }

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    loadShops();
  }

  // ==========================================================
  //  ABOUT PAGE — Join form validation + URL Search Params
  // ==========================================================
  const joinForm = document.getElementById('join-form');

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      function setError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (!field || !error) return;
        if (message) {
          field.classList.add('invalid');
          error.textContent = message;
          valid = false;
        } else {
          field.classList.remove('invalid');
          error.textContent = '';
        }
      }

      // Validate name
      const nameEl = document.getElementById('name');
      const nameValue = nameEl ? nameEl.value.trim() : '';
      setError('name', 'name-error', nameValue ? '' : 'Please enter your name.');

      // Validate email
      const emailEl = document.getElementById('email');
      const emailValue = emailEl ? emailEl.value.trim() : '';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValue) {
        setError('email', 'email-error', 'Please enter your email address.');
      } else if (!emailPattern.test(emailValue)) {
        setError('email', 'email-error', 'Please enter a valid email address.');
      } else {
        setError('email', 'email-error', '');
      }

      // Validate skill level
      const skillEl = document.getElementById('skill');
      const skillValue = skillEl ? skillEl.value : '';
      const skillText = skillEl && skillEl.selectedIndex >= 0
        ? skillEl.options[skillEl.selectedIndex].text : '';
      setError('skill', 'skill-error', skillValue ? '' : 'Please select your skill level.');

      // Capture interest (optional)
      const interestEl = document.getElementById('interest');
      const interestText = interestEl && interestEl.selectedIndex >= 0
        ? interestEl.options[interestEl.selectedIndex].text : 'None selected';

      // If valid — build URL params and redirect
      if (valid) {
        const params = new URLSearchParams();
        params.set('name', nameValue);
        params.set('email', emailValue);
        params.set('skill', skillText);
        params.set('interest', interestText);

        joinForm.reset();
        window.location.href = `thank-you.html?${params.toString()}`;
      }
    });

    // Real-time error clearing
    ['name', 'email', 'skill'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const eventType = element.tagName === 'SELECT' ? 'change' : 'input';
        element.addEventListener(eventType, () => {
          element.classList.remove('invalid');
          const errorEl = document.getElementById(`${id}-error`);
          if (errorEl) errorEl.textContent = '';
        });
      }
    });
  }

}); // end DOMContentLoaded