// ========== CONFIGURATION ==========
const defaultConfig = {
  background_color: "#0B0B0F",
  card_color: "#1A1623",
  text_color: "#FFFFFF",
  purple_color: "#A855F7",
  pink_color: "#F472B6",
  font_family: "Poppins",
  font_size: 16,
  hero_name: "Winnie Macharia",
  hero_title: "Software Developer & AI Enthusiast",
  hero_description: "I build web experiences that work. Computer Science student who actually ships things – from full-stack trading platforms to mobile health apps. I focus on clean code, thoughtful UX, and solving real problems."
};

// ========== PROJECT DATA FOR MODALS ==========
const projectData = {
   
  'modal-tradelink': {
    title: 'TradeLink',
    period: '2026',
    description: '',
    image: 'assets/images/trade.png',
    features: [
      'Product browsing and search',
      'Shopping cart with persistent storage',
      'Secure checkout flow',
      'Order history for users'
    ],
    challenges: [
      'Coordinating with backend team on API contracts',
      'Managing state between cart and checkout',
      'Real-time inventory updates'
    ],
    accomplishments: [
      'Successfully integrated with team\'s REST API',
      'Reduced cart abandonment with saved cart feature',
      'Implemented responsive design for mobile shoppers'
    ],
    techStack: ['React.js', 'Django', 'MongoDB', 'CSS'],
  },
  
  'modal-foodflow': {
    title: 'FoodFlow',
    period: '2026',
    description: '',
    image: 'assets/images/food.png',
    features: [
      'Real-time inventory tracking',
      'Low stock alerts',
      'Supplier management',
      'Order processing'
    ],
    challenges: [
      'Designing database schema for inventory tracking',
      'Implementing real-time updates',
      'User role permissions'
    ],
    accomplishments: [
      'Built fully functional system that is actively used',
      'Trained staff on how to use the system',
      'Reduced manual inventory errors by 80%'
    ],
    techStack: ['Java', 'MySQL', 'CSS', 'HTML', 'Javascript'],
  }
};

// ========== LOAD ALL SECTIONS ==========
async function loadAllSections() {
  const sections = [
    { id: 'navbar-container', file: 'navbar' },
    { id: 'hero-container', file: 'hero' },
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
  
  setTimeout(initializeAfterLoad, 100);
}

// ========== MODAL SYSTEM ==========
function initModalSystem() {
  const modal = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  
  if (!modal) return;
  
  // Close modal function
  window.closeModal = function() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };
  
  // Close on button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('flex')) {
      closeModal();
    }
  });
}

function openModal(modalId) {
  const data = projectData[modalId];
  if (!data) {
    console.warn(`No data found for modal: ${modalId}`);
    return;
  }
  
  const modal = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-3xl font-bold gradient-text">${escapeHtml(data.title)}</h2>
    </div>
    <p class="text-sm text-zinc-500 mb-4">${escapeHtml(data.period || 'Project')}</p>
    
    ${data.image ? `<img src="${data.image}" alt="${data.title}" class="w-full rounded-xl mb-6" onerror="this.style.display='none'">` : ''}
    
    <p class="text-zinc-300 mb-6 leading-relaxed">${escapeHtml(data.description)}</p>
    
    ${data.features ? `
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-[#F472B6] mb-3">Features</h3>
        <ul class="list-disc list-inside text-zinc-400 space-y-1">
          ${data.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${data.challenges ? `
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-[#F472B6] mb-3">Challenges</h3>
        <ul class="list-disc list-inside text-zinc-400 space-y-1">
          ${data.challenges.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${data.accomplishments ? `
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-[#F472B6] mb-3">Accomplishments</h3>
        <ul class="list-disc list-inside text-zinc-400 space-y-1">
          ${data.accomplishments.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${data.techStack ? `
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-[#F472B6] mb-3">Tech Stack</h3>
        <div class="flex flex-wrap gap-2">
          ${data.techStack.map(tech => `<span class="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">${escapeHtml(tech)}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    
    <div class="flex gap-4 mt-6 flex-wrap">
      ${data.github ? `<a href="${data.github}" target="_blank" class="primary-button px-5 py-2 rounded-full text-sm inline-flex items-center gap-2">GitHub <i data-lucide="external-link" class="h-3 w-3"></i></a>` : ''}
      ${data.liveDemo ? `<a href="${data.liveDemo}" target="_blank" class="secondary-button px-5 py-2 rounded-full text-sm inline-flex items-center gap-2">Live Demo <i data-lucide="external-link" class="h-3 w-3"></i></a>` : ''}
      ${data.youtube ? `<a href="${data.youtube}" target="_blank" class="secondary-button px-5 py-2 rounded-full text-sm inline-flex items-center gap-2">YouTube <i data-lucide="external-link" class="h-3 w-3"></i></a>` : ''}
    </div>
  `;
  
  // Re-initialize Lucide icons in modal
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Helper function to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attachModalTriggers() {
  document.querySelectorAll('[data-modal]').forEach(card => {
    if (card.dataset.modalReady === 'true') return;
    card.dataset.modalReady = 'true';

    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on a link inside the card
      if (e.target.tagName === 'A' || e.target.closest('a')) return;

      const modalId = card.getAttribute('data-modal');
      openModal(modalId);
    });
  });
}

// ========== THEME TOGGLE (LIGHT/DARK MODE) ==========
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.body.classList.add('light-mode');
    updateThemeIcon('light');
  } else {
    document.body.classList.remove('light-mode');
    updateThemeIcon('dark');
  }
  
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight ? 'light' : 'dark');
    
    // Recreate Lucide icons to update icon if needed
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  if (theme === 'light') {
    themeToggle.innerHTML = '<i data-lucide="sun" class="h-5 w-5"></i>';
  } else {
    themeToggle.innerHTML = '<i data-lucide="moon" class="h-5 w-5"></i>';
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ========== INITIALIZE AFTER SECTIONS LOAD ==========
function initializeAfterLoad() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  if (menuToggle && mobileMenu) {
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
  
  // Active link highlighting
  const sections = document.querySelectorAll('main section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const navbarHeight = 85;
  
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
  
  // Smooth anchor links with navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const targetPosition = targetElement.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Attach modal triggers to project cards
  attachModalTriggers();
  
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
  console.log('🦋 Welcome to Winnie Macharia\'s portfolio!');
  console.log('✨ Pink butterfly with shimmering particles active');
  console.log('🎨 Light/Dark mode ready');
  console.log('📅 Loaded on:', new Date().toLocaleString());
}

// ========== PINK BUTTERFLY WITH SHIMMERING PARTICLES ==========
function initButterflyEffect() {
  // Only run on devices with a mouse
  if (!window.matchMedia('(pointer: fine)').matches) return;
  
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
  
  setInterval(() => {
    if (Math.abs(mouseX - butterflyX) < 15 && Math.abs(mouseY - butterflyY) < 15 && mouseX > 0) {
      createParticle(butterflyX + (Math.random() - 0.5) * 25, butterflyY + (Math.random() - 0.5) * 25);
    }
  }, 1000);
}

// ========== START THE APP ==========
// Initialize modal system first
initModalSystem();

// Load all sections
loadAllSections();

// Initialize theme toggle
initThemeToggle();

// Initialize butterfly effect
initButterflyEffect();

// ========== FLOATING AI CHAT ==========

async function askGemini(question) {
  try {
    const response = await fetch('/.netlify/functions/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    
    const data = await response.json();
    
    if (response.ok && data.answer) {
      return data.answer;
    } else {
      return data.error || "Sorry, I had trouble answering that. Please try again!";
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return "Connection issue. Please try again in a moment.";
  }
}

// Initialize Floating Chat
function initFloatingChat() {
  const chatButton = document.getElementById('chat-button');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-window-input');
  const chatSend = document.getElementById('chat-window-send');
  const chatMessages = document.getElementById('chat-window-messages');
  
  if (!chatButton || !chatWindow) return;
  
  // Open chat
  chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput?.focus();
    }
  });
  
  // Close chat
  chatClose?.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });
  
  function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
    messageDiv.innerHTML = `
      <div class="${isUser ? 'bg-gradient-to-r from-[#A855F7] to-[#F472B6] text-white' : 'glass text-white'} rounded-2xl ${isUser ? 'rounded-br-none' : 'rounded-bl-none'} px-4 py-2 max-w-[85%]">
        <p class="text-sm">${escapeHtml(text)}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  async function sendMessage() {
    const question = chatInput.value.trim();
    if (!question) return;
    
    addMessage(question, true);
    chatInput.value = '';
    
    // Typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start';
    typingDiv.id = 'chat-typing';
    typingDiv.innerHTML = `
      <div class="glass rounded-2xl rounded-bl-none px-4 py-2">
        <p class="text-sm text-zinc-400">Winnie is typing<span class="animate-pulse">...</span></p>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const answer = await askGemini(question);
    
    document.getElementById('chat-typing')?.remove();
    addMessage(answer, false);
  }
  
  chatSend?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// Initialize chat when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingChat);
} else {
  setTimeout(initFloatingChat, 500);
}
