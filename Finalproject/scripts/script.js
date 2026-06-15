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
        renderProjects(allProjects, projectsGrid, noResults);
        initFilters(filterButtons, (filtered) => {
          renderProjects(filtered, projectsGrid, noResults);
        }, allProjects);
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
        renderTools(allTools, toolsList, noResults);
        initFilters(filterButtons, (filtered) => {
          renderTools(filtered, toolsList, noResults);
        }, allTools);
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
        }, allShops);
      } catch (err) {
        shopsGrid.innerHTML = '<p>Sorry, shops could not be loaded.</p>';
        console.error('Error loading shops:', err);
      }
    }

    // ── Open modal ─────────────────────────────────────
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

    // ── Close modal ────────────────────────────────────
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

}); // end DOMContentLoaded
