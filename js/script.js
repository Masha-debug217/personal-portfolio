/*
  Personal Portfolio - Winnie Masha
  Main JavaScript file with:
  - Section loading
  - Pink butterfly cursor with shimmering particles
  - Scroll reveal animations
  - Fixed navbar support
*/

// ========== CONFIGURATION ==========
const defaultConfig = {
  background_color: "#0B0B0F",
  card_color: "#1A1623",
  text_color: "#FFFFFF",
  purple_color: "#A855F7",
  pink_color: "#F472B6",
  font_family: "Poppins",
  font_size: 16,
  logo_text: "Winnie.",
  hero_name: "Winnie Masha",
  hero_title: "Software Developer & AI Enthusiast",
  hero_description: "I am passionate about building modern web applications, creating intuitive UI/UX designs, and exploring AI systems. I enjoy turning ideas into functional and visually appealing digital experiences.",
  footer_text: "Built with passion ✨ by Winnie — Code. Create. Evolve."
};

// ========== LOAD ALL SECTIONS ==========
async function loadAllSections() {
  const sections = [
    { id: 'navbar-container', file: 'navbar' },
    { id: 'hero-container', file: 'hero' },
    { id: 'about-container', file: 'about' },
    { id: 'services-container', file: 'services' },
    { id: 'skills-container', file: 'skills' },
    { id: 'projects-container', file: 'projects' },
    { id: 'contact-container', file: 'contact' },
    { id: 'footer-container', file: 'footer' }
  ];
  
  for (const section of sections) {
    try {
      const response = await fetch(`sections/${section.file}.html`);
      if (response.ok) {
        const html = await response.text();
        const container = document.getElementById(section.id);
        if (container) {
          container.innerHTML = html;
        }
      } else {
        console.warn(`Could not load ${section.file}`);
      }
    } catch (error) {
      console.error(`Error loading ${section.file}:`, error);
    }
  }
  
  // After all sections loaded, initialize everything
  setTimeout(initializeAfterLoad, 100);
}

// ========== INITIALIZE AFTER SECTIONS LOAD ==========
function initializeAfterLoad() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  if (menuToggle && mobileMenu) {
    // Remove any existing listeners to avoid duplicates
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    newMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      newMenuToggle.setAttribute('aria-expanded', String(isOpen));
      newMenuToggle.innerHTML = isOpen
        ? '<i data-lucide="x" class="h-5 w-5"></i>'
        : '<i data-lucide="menu" class="h-5 w-5"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        if (newMenuToggle) {
          newMenuToggle.setAttribute('aria-expanded', 'false');
          newMenuToggle.innerHTML = '<i data-lucide="menu" class="h-5 w-5"></i>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    });
  }
  
  // Reveal animations on scroll
  const shell = document.getElementById('portfolio-shell');
  const revealItems = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  
  revealItems.forEach((item) => revealObserver.observe(item));
  
  // Active link highlighting on scroll (accounting for fixed navbar)
  const sections = document.querySelectorAll('main section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const navbarHeight = 85; // pixels of fixed navbar
  
  function updateActiveLink() {
    if (!sections.length || !allNavLinks.length) return;
    
    let currentId = 'home';
    const scrollPosition = window.scrollY + navbarHeight + 50;
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentId = section.getAttribute('id');
      }
    });
    
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
  
  // Fix anchor links to account for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = 85;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Apply configuration
  applyConfig(defaultConfig);
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Dynamic year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Console greeting
  console.log('🦋 Welcome to Winnie Masha\'s portfolio!');
  console.log('✨ Pink butterfly with shimmering particles active');
  console.log('📌 Fixed navbar - never scrolls');
  console.log('📅 Loaded on:', new Date().toLocaleString());
}

// ========== APPLY DYNAMIC CONFIGURATION ==========
function applyConfig(config) {
  const backgroundColor = config.background_color || defaultConfig.background_color;
  const cardColor = config.card_color || defaultConfig.card_color;
  const purpleColor = config.purple_color || defaultConfig.purple_color;
  const pinkColor = config.pink_color || defaultConfig.pink_color;
  
  document.documentElement.style.setProperty('--background-color', backgroundColor);
  document.documentElement.style.setProperty('--card-color', cardColor);
  document.documentElement.style.setProperty('--text-color', config.text_color || defaultConfig.text_color);
  document.documentElement.style.setProperty('--purple-color', purpleColor);
  document.documentElement.style.setProperty('--pink-color', pinkColor);
  
  // Update text content when elements exist
  setTimeout(() => {
    const logoText = document.getElementById('logoText');
    const heroName = document.getElementById('heroName');
    const heroTitle = document.getElementById('heroTitle');
    const heroDescription = document.getElementById('heroDescription');
    const footerText = document.getElementById('footerText');
    
    if (logoText) logoText.textContent = config.logo_text || defaultConfig.logo_text;
    if (heroName) heroName.textContent = config.hero_name || defaultConfig.hero_name;
    if (heroTitle) heroTitle.textContent = config.hero_title || defaultConfig.hero_title;
    if (heroDescription) heroDescription.textContent = config.hero_description || defaultConfig.hero_description;
    if (footerText) footerText.textContent = config.footer_text || defaultConfig.footer_text;
  }, 200);
}

// ========== PINK BUTTERFLY WITH SHIMMERING PARTICLES ==========
function initButterflyEffect() {
  // Only run on devices with a mouse
  if (!window.matchMedia('(pointer: fine)').matches) return;
  
  // Create butterfly element with custom pink SVG
  const butterfly = document.createElement('div');
  butterfly.className = 'cursor-butterfly';
  butterfly.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="butterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F472B6"/>
          <stop offset="50%" style="stop-color:#F9A8D4"/>
          <stop offset="100%" style="stop-color:#EC4899"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M16 14 C10 4, 2 6, 2 14 C2 20, 8 22, 16 18" fill="url(#butterflyGrad)" filter="url(#glow)" opacity="0.9"/>
      <path d="M16 14 C22 4, 30 6, 30 14 C30 20, 24 22, 16 18" fill="url(#butterflyGrad)" filter="url(#glow)" opacity="0.9"/>
      <path d="M16 18 C12 24, 6 26, 4 22 C2 18, 8 16, 16 18" fill="#F472B6" opacity="0.7"/>
      <path d="M16 18 C20 24, 26 26, 28 22 C30 18, 24 16, 16 18" fill="#F472B6" opacity="0.7"/>
      <ellipse cx="16" cy="16" rx="2" ry="6" fill="#EC4899"/>
      <path d="M14 10 Q12 6, 10 8" stroke="#F472B6" stroke-width="1" fill="none"/>
      <path d="M18 10 Q20 6, 22 8" stroke="#F472B6" stroke-width="1" fill="none"/>
      <circle cx="10" cy="12" r="1.5" fill="#FFF" opacity="0.6"/>
      <circle cx="22" cy="12" r="1.5" fill="#FFF" opacity="0.6"/>
    </svg>
  `;
  document.body.appendChild(butterfly);
  
  let mouseX = 0, mouseY = 0;
  let butterflyX = 0, butterflyY = 0;
  let lastParticleX = 0, lastParticleY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function createParticle(x, y) {
    const rand = Math.random();
    let particle;
    
    if (rand < 0.25) {
      particle = document.createElement('div');
      particle.className = 'particle-sparkle';
      const sparkles = ['✨', '💖', '🌸', '⭐'];
      particle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.color = `hsl(${320 + Math.random() * 40}, 80%, 70%)`;
      
      const tx = (Math.random() - 0.5) * 40;
      const ty = (Math.random() - 0.5) * 30 - 10;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
    } else {
      particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      const hue = 320 + Math.random() * 40;
      particle.style.backgroundColor = `hsl(${hue}, 90%, 65%)`;
      particle.style.boxShadow = `0 0 8px hsl(${hue}, 90%, 65%)`;
      
      const size = 4 + Math.random() * 6;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
    }
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      if (particle && particle.remove) particle.remove();
    }, 700);
  }
  
  function animateButterfly() {
    butterflyX += (mouseX - butterflyX) * 0.15;
    butterflyY += (mouseY - butterflyY) * 0.15;
    
    butterfly.style.left = butterflyX + 'px';
    butterfly.style.top = butterflyY + 'px';
    
    const dx = mouseX - lastParticleX;
    const dy = mouseY - lastParticleY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    if (speed > 8) {
      const particleCount = Math.min(2, Math.floor(speed / 12));
      for (let i = 0; i < particleCount; i++) {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        createParticle(mouseX + offsetX, mouseY + offsetY);
      }
      lastParticleX = mouseX;
      lastParticleY = mouseY;
    }
    
    const flutter = Math.sin(Date.now() * 0.015) * 0.1;
    butterfly.style.transform = `translate(-50%, -50%) scale(${1 + flutter * 0.15}) rotate(${dx * 0.3}deg)`;
    
    requestAnimationFrame(animateButterfly);
  }
  
  animateButterfly();
  
  // Gentle floating particles when mouse is still
  setInterval(() => {
    if (Math.abs(mouseX - butterflyX) < 15 && Math.abs(mouseY - butterflyY) < 15 && mouseX > 0) {
      createParticle(butterflyX + (Math.random() - 0.5) * 25, butterflyY + (Math.random() - 0.5) * 25);
    }
  }, 1000);
}

// ========== START THE APP ==========
// First load all sections
loadAllSections();

// Then initialize butterfly effect (it doesn't depend on sections)
initButterflyEffect();