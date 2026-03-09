/* ============================================================
   NAVIGATION — scroll state + mobile toggle
   ============================================================ */
const nav        = document.getElementById('nav');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
const navItems   = navLinks.querySelectorAll('.nav__link');

function updateNav() {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navItems.forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active link highlight based on scroll position
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY + nav.offsetHeight + 20;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = navLinks.querySelector(`[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();


/* ============================================================
   GALLERY FILTER
   ============================================================ */
const filterTabs  = document.querySelectorAll('.filter-tab');
const galleryGrid = document.getElementById('galleryGrid');
const items       = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden', 'fade-out');
      } else {
        item.classList.add('fade-out');
        setTimeout(() => item.classList.add('hidden'), 350);
      }
    });
  });
});


/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxMeta  = document.getElementById('lightboxMeta');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

let currentIndex    = 0;
let visibleItems    = [];

function getVisibleItems() {
  return items.filter(item => !item.classList.contains('hidden'));
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentIndex = index;
  showImage(currentIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showImage(index) {
  const item  = visibleItems[index];
  const img   = item.querySelector('img');
  const title = item.querySelector('.gallery-item__title');
  const meta  = item.querySelector('.gallery-item__meta');

  lightboxImg.classList.add('loading');

  const tmpImg  = new Image();
  tmpImg.src    = img.src;
  tmpImg.onload = () => {
    lightboxImg.src           = img.src;
    lightboxImg.alt           = img.alt;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxMeta.textContent  = meta  ? meta.textContent  : '';
    lightboxImg.classList.remove('loading');
  };
}

function prevImage() {
  visibleItems = getVisibleItems();
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showImage(currentIndex);
}

function nextImage() {
  visibleItems = getVisibleItems();
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showImage(currentIndex);
}

// Attach open triggers
items.forEach((item, i) => {
  const btn = item.querySelector('.gallery-item__overlay');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const visible = getVisibleItems();
    const visIdx  = visible.indexOf(item);
    if (visIdx > -1) openLightbox(visIdx);
  });
  // Also open on item click
  item.addEventListener('click', () => {
    const visible = getVisibleItems();
    const visIdx  = visible.indexOf(item);
    if (visIdx > -1) openLightbox(visIdx);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click',  prevImage);
lightboxNext.addEventListener('click',  nextImage);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevImage();
  if (e.key === 'ArrowRight')  nextImage();
});

// Touch/swipe support for lightbox
let touchStartX = 0;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 50) {
    delta < 0 ? nextImage() : prevImage();
  }
}, { passive: true });


/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm    = document.getElementById('contactForm');
const formSuccess    = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  // Simulate async send (replace with real API call)
  setTimeout(() => {
    contactForm.reset();
    btn.textContent = 'Send Message';
    btn.disabled    = false;
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});


/* ============================================================
   SCROLL REVEAL  (IntersectionObserver)
   ============================================================ */
function addRevealClass(selector, stagger = false) {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add(stagger ? 'reveal-stagger' : 'reveal');
  });
}

addRevealClass('.section-header');
addRevealClass('.about-section__image-col');
addRevealClass('.about-section__text-col');
addRevealClass('.about-section__stats', true);
addRevealClass('.contact-form');
addRevealClass('.filter-tabs');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));

// Stagger gallery items on load
const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const visItems = getVisibleItems();
      visItems.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity    = '1';
          item.style.transform  = 'translateY(0)';
        }, i * 60);
      });
      gridObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

// Initial hidden state for stagger
items.forEach(item => {
  item.style.opacity   = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});

gridObserver.observe(galleryGrid);
