/* ==========================================================================
   SIDDHANT KULKARNI PORTFOLIO 2026-27 — APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // DOM Elements
  const btnHamburger = document.getElementById('btnHamburger');
  const hamburgerDrawer = document.getElementById('hamburgerDrawer');
  const drawerTagsList = document.getElementById('drawerTagsList');
  const currentCategoryPill = document.getElementById('currentCategoryPill');
  const currentCategoryName = document.getElementById('currentCategoryName');
  const storySections = document.querySelectorAll('.story-section');
  const drawerTags = drawerTagsList ? drawerTagsList.querySelectorAll('.tape-tag') : [];

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lbWrapper = document.getElementById('lightboxImgWrapper');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const btnThankYouConfetti = document.getElementById('btnThankYouConfetti');

  let zoomScale = 1;
  let isDragging = false;
  let startX = 0, startY = 0, translateX = 0, translateY = 0;

  /* ==========================================================================
     1. HAMBURGER MENU DRAWER TOGGLE LOGIC
     ========================================================================== */
  function toggleHamburger() {
    const isActive = hamburgerDrawer.classList.contains('active');
    if (isActive) {
      closeHamburger();
    } else {
      openHamburger();
    }
  }

  function openHamburger() {
    hamburgerDrawer.classList.add('active');
    btnHamburger.classList.add('active');
  }

  function closeHamburger() {
    hamburgerDrawer.classList.remove('active');
    btnHamburger.classList.remove('active');
  }

  if (btnHamburger) {
    btnHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHamburger();
    });
  }

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (hamburgerDrawer && hamburgerDrawer.classList.contains('active')) {
      if (!hamburgerDrawer.contains(e.target) && !btnHamburger.contains(e.target)) {
        closeHamburger();
      }
    }
  });

  // Smooth scroll & close drawer when clicking a category link inside drawer
  drawerTags.forEach(tag => {
    tag.addEventListener('click', () => {
      closeHamburger();
    });
  });

  /* ==========================================================================
     2. SCROLL OBSERVER & CURRENT CATEGORY INDICATOR PILL
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -45% 0px',
    threshold: 0.1
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        const category = entry.target.dataset.category;
        const label = entry.target.dataset.label;
        const tagClass = entry.target.dataset.tagclass;

        // Skip updating for sections marked as 'none'
        if (!category || category === 'none') {
          if (currentCategoryPill) currentCategoryPill.classList.add('hidden');
          drawerTags.forEach(t => t.classList.remove('active'));
          return;
        }

        // Show and update Current Category Pill in top header
        if (currentCategoryPill && label) {
          currentCategoryPill.classList.remove('hidden');
          currentCategoryName.textContent = label;

          // Remove old tag color classes and add new tag color class
          currentCategoryPill.className = 'current-category-pill ' + (tagClass || '');
        }

        // Highlight active tag inside drawer
        drawerTags.forEach(tag => {
          if (tag.dataset.category === category) {
            tag.classList.add('active');
          } else {
            tag.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  storySections.forEach(sec => sectionObserver.observe(sec));

  /* ==========================================================================
     3. LIGHTBOX MODAL LOGIC
     ========================================================================== */
  function openLightbox(src) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetZoom();
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
  }

  function resetZoom() {
    zoomScale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  function applyTransform() {
    lbWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
  }

  function zoomIn() {
    zoomScale = Math.min(zoomScale + 0.35, 3.5);
    applyTransform();
  }

  function zoomOut() {
    zoomScale = Math.max(zoomScale - 0.35, 0.7);
    if (zoomScale <= 1) {
      translateX = 0;
      translateY = 0;
    }
    applyTransform();
  }

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
  if (btnZoomIn) btnZoomIn.addEventListener('click', zoomIn);
  if (btnZoomOut) btnZoomOut.addEventListener('click', zoomOut);
  if (btnZoomReset) btnZoomReset.addEventListener('click', resetZoom);

  // Attach Lightbox triggers to image elements with data-lightbox attribute
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.lightbox || el.querySelector('img')?.src;
      openLightbox(src);
    });
  });

  // Lightbox Pan Dragging Logic
  lbWrapper.addEventListener('mousedown', (e) => {
    if (zoomScale <= 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Keyboard Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
      if (hamburgerDrawer && hamburgerDrawer.classList.contains('active')) {
        closeHamburger();
      }
    }
  });

  /* ==========================================================================
     4. CELEBRATORY CONFETTI ON "THANK YOU"
     ========================================================================== */
  if (btnThankYouConfetti) {
    btnThankYouConfetti.addEventListener('click', () => {
      createConfettiParticles();
    });
  }

  function createConfettiParticles() {
    const colors = ['#FDE047', '#F472B6', '#86EFAC', '#DBEAFE', '#B91C1C', '#CFF4FC'];
    const container = document.body;

    for (let i = 0; i < 45; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `-20px`;
      particle.style.width = `${Math.random() * 10 + 6}px`;
      particle.style.height = `${Math.random() * 10 + 6}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      particle.style.zIndex = '9999';
      particle.style.pointerEvents = 'none';
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      particle.style.transition = `transform ${Math.random() * 2 + 1.5}s ease-out, top ${Math.random() * 2 + 1.5}s ease-out, opacity 2s ease`;

      container.appendChild(particle);

      setTimeout(() => {
        particle.style.top = `${window.innerHeight + 40}px`;
        particle.style.transform = `translate(${Math.random() * 100 - 50}px, 0) rotate(${Math.random() * 720}deg)`;
        particle.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        particle.remove();
      }, 3500);
    }
  }

});
