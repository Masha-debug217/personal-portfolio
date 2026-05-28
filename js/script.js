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

// ========== DYNAMIC PROJECTS FROM LOCALSTORAGE ==========
function getProjectsFromStorage() {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultProjects = [
        {
            id: "project_tradelink",
            title: "TradeLink",
            description: "E-commerce platform with checkout flow. Acted as the dedicated Full-Stack Payment Engineer for a group project, independently building the frontend checkout interface and backend architecture to integrate the PayHero payment gateway.",
            imageUrl: "assets/images/trade.png",
            projectLink: "#",
            githubLink: "#",
            technologies: ["React", "Django", "MongoDB", "CSS"],
            dateAdded: "2024-01-15",
            clickCount: 0,
            modalId: "modal-tradelink"
        },
        {
            id: "project_lipia",
            title: "Lipia",
            description: "Fintech UI concept bridging Kenyan payments with global e-commerce.",
            imageUrl: "",
            projectLink: "",
            githubLink: "",
            technologies: ["Figma", "Fintech"],
            dateAdded: "2024-01-20",
            clickCount: 0,
            modalId: null,
            figmaLink: "https://www.figma.com/design/ffqvZtYYejDiQLdCYrtikA/Lipia"
        },
        {
            id: "project_shining_steps",
            title: "Shining Steps",
            description: "Website design for an autism support organization. Focus on accessibility.",
            imageUrl: "",
            projectLink: "",
            githubLink: "",
            technologies: ["Figma", "Accessibility"],
            dateAdded: "2024-02-01",
            clickCount: 0,
            modalId: null,
            figmaLink: "https://www.figma.com/design/qo51cZ1gC69Y1dEeTuXxni/Shining-Steps"
        },
        {
            id: "project_clicket",
            title: "Clicket",
            description: "Mobile event ticketing UI with smooth booking flow.",
            imageUrl: "",
            projectLink: "",
            githubLink: "",
            technologies: ["Figma", "Mobile UI"],
            dateAdded: "2024-02-05",
            clickCount: 0,
            modalId: null,
            figmaLink: "https://www.figma.com/design/nSfSQgLjIMTtx79mmpTY2Y/Clicket"
        },
        {
            id: "project_cervibloom",
            title: "CerviBloom",
            description: "Mobile app interface for cervical cancer awareness and prevention.",
            imageUrl: "",
            projectLink: "",
            githubLink: "",
            technologies: ["Figma", "Health Tech"],
            dateAdded: "2024-02-10",
            clickCount: 0,
            modalId: null,
            figmaLink: "https://www.figma.com/design/C3xLEEAR7hZHiZrGyS9Z2u/CerviBloom"
        },
        {
            id: "project_foodflow",
            title: "FoodFlow",
            description: "Inventory management system for a catering department. Functional and in use.",
            imageUrl: "assets/images/food.png",
            projectLink: "#",
            githubLink: "#",
            technologies: ["Java", "HTML", "JavaScript", "CSS"],
            dateAdded: "2024-01-25",
            clickCount: 0,
            modalId: "modal-foodflow"
        }
    ];
    
    localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjects));
    return defaultProjects;
}

function getProjectById(projectId) {
    const projects = getProjectsFromStorage();
    const storedId = projectId.replace('modal-', 'project_');
    return projects.find(p => p.id === storedId);
}

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getProjectClickStats() {
    const saved = localStorage.getItem('portfolio_project_clicks');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultStats = {};
    localStorage.setItem('portfolio_project_clicks', JSON.stringify(defaultStats));
    return defaultStats;
}

function incrementProjectClick(projectId, clickType = 'modal') {
    const projects = getProjectsFromStorage();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        console.warn(`No project found for click tracking: ${projectId}`);
        return;
    }
    
    project.clickCount = (project.clickCount || 0) + 1;
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));

    const stats = getProjectClickStats();
    const today = getLocalDateKey();
    const safeClickType = clickType === 'figma' ? 'figma' : 'modal';
    
    if (!stats[today]) {
        stats[today] = {};
    }
    
    if (!stats[today][projectId]) {
        stats[today][projectId] = { modal: 0, figma: 0 };
    }
    
    stats[today][projectId][safeClickType] = (stats[today][projectId][safeClickType] || 0) + 1;
    localStorage.setItem('portfolio_project_clicks', JSON.stringify(stats));
}

// ========== GENERATE PROJECT CARDS DYNAMICALLY ==========
function renderDynamicProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    const projects = getProjectsFromStorage();
    
    const projectsHTML = `
        <section id="projects" class="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
            <div class="reveal mb-12 text-center">
                <p class="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#F472B6]">Projects</p>
                <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">What I've built</h2>
                <p class="mx-auto mt-5 max-w-2xl leading-8 text-zinc-400">Full-stack applications, design concepts, and features I'm proud of.</p>
            </div>
            
            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                ${projects.map(project => generateProjectCard(project)).join('')}
            </div>
        </section>
    `;
    
    projectsContainer.innerHTML = projectsHTML;
    
    setTimeout(() => {
        attachModalTriggers();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 50);
}

function generateProjectCard(project) {
    const hasModal = project.modalId && (project.id === "project_tradelink" || project.id === "project_foodflow");
    const hasFigma = project.figmaLink;
    
    let actionHTML = '';
    let cardClass = 'reveal project-card glass rounded-[2rem] p-7 transition-all';
    
    if (hasModal) {
        cardClass += ' cursor-pointer';
        actionHTML = `<div class="mt-5"><span class="text-sm text-[#F472B6]">Click to learn more →</span></div>`;
    } else if (hasFigma) {
        actionHTML = `
            <div class="mt-5">
                <a href="${project.figmaLink}" target="_blank" class="primary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all">
                    View in Figma <i data-lucide="external-link" class="h-3 w-3"></i>
                </a>
            </div>
        `;
    }
    
    if (hasModal) {
        actionHTML = `
            <div class="mt-5">
                <button type="button" onclick="event.stopPropagation(); openModal('${project.modalId}')" class="text-sm text-[#F472B6]">
                    Click to learn more →
                </button>
            </div>
        `;
    } else if (hasFigma) {
        actionHTML = `
            <div class="mt-5">
                <a href="${escapeHtml(project.figmaLink)}" target="_blank" onclick="incrementProjectClick('${project.id}', 'figma')" class="primary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all">
                    View in Figma <i data-lucide="external-link" class="h-3 w-3"></i>
                </a>
            </div>
        `;
    }
    
    let iconHtml = '<i data-lucide="code-2" class="h-6 w-6 text-[#F472B6]"></i>';
    if (project.title === "TradeLink") iconHtml = '<i data-lucide="shopping-bag" class="h-6 w-6 text-[#F472B6]"></i>';
    if (project.title === "Lipia") iconHtml = '<i data-lucide="credit-card" class="h-6 w-6 text-[#F472B6]"></i>';
    if (project.title === "Shining Steps") iconHtml = '<i data-lucide="heart-handshake" class="h-6 w-6 text-[#F472B6]"></i>';
    if (project.title === "Clicket") iconHtml = '<i data-lucide="ticket" class="h-6 w-6 text-[#F472B6]"></i>';
    if (project.title === "CerviBloom") iconHtml = '<i data-lucide="flower-2" class="h-6 w-6 text-[#F472B6]"></i>';
    if (project.title === "FoodFlow") iconHtml = '<i data-lucide="boxes" class="h-6 w-6 text-[#F472B6]"></i>';
    
    return `
        <article class="${cardClass}" ${hasModal ? `data-modal="${project.modalId}"` : ''}>
            <div class="mb-3 flex items-center justify-between">
                <h3 class="text-2xl font-bold">${escapeHtml(project.title)}</h3>
                ${iconHtml}
            </div>
            <p class="text-sm text-zinc-500 mb-3">${project.dateAdded}</p>
            <p class="leading-7 text-zinc-400">${escapeHtml(project.description.substring(0, 120))}${project.description.length > 120 ? '...' : ''}</p>
            <div class="mt-4 flex flex-wrap gap-2">
                ${project.technologies.map(tech => `<span class="rounded-full bg-[#A855F7]/15 px-3 py-1 text-xs">${escapeHtml(tech)}</span>`).join('')}
            </div>
            ${actionHTML}
        </article>
    `;
}

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

                    if (section.file === 'services') {
                        loadServicesFromStorage();
                    }

                    if (section.file === 'skills') {
                        loadSkillsFromStorage();
                    }

                    if (section.file === 'contact') {
                        loadContactFromStorage();
                    }
                }
            } else {
                console.warn(`Could not load ${section.file}`);
            }
        } catch (error) {
            console.error(`Error loading ${section.file}:`, error);
        }
    }
    
    renderDynamicProjects();
    
    setTimeout(initializeAfterLoad, 100);
}

// ========== MODAL SYSTEM ==========
function initModalSystem() {
  const modal = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  
  if (!modal) return;
  
  window.closeModal = function() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('flex')) {
      closeModal();
    }
  });
}

function openModal(modalId) {
    const project = getProjectById(modalId);
    
    if (!project) {
        console.warn(`No project found for modal: ${modalId}`);
        return;
    }

    incrementProjectClick(project.id, 'modal');
    
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h2 class="text-3xl font-bold gradient-text">${escapeHtml(project.title)}</h2>
        </div>
        <p class="text-sm text-zinc-500 mb-4">${escapeHtml(project.dateAdded)}</p>
        
        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-full rounded-xl mb-6" onerror="this.style.display='none'">` : ''}
        
        <p class="text-zinc-300 mb-6 leading-relaxed">${escapeHtml(project.description)}</p>
        
        <div class="mb-6">
            <h3 class="text-xl font-semibold text-[#F472B6] mb-3">Tech Stack</h3>
            <div class="flex flex-wrap gap-2">
                ${project.technologies.map(tech => `<span class="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">${escapeHtml(tech)}</span>`).join('')}
            </div>
        </div>
        
        <div class="flex gap-4 mt-6 flex-wrap">
            ${project.githubLink && project.githubLink !== '#' ? `<a href="${project.githubLink}" target="_blank" class="primary-button px-5 py-2 rounded-full text-sm inline-flex items-center gap-2">GitHub <i data-lucide="external-link" class="h-3 w-3"></i></a>` : ''}
            ${project.projectLink && project.projectLink !== '#' ? `<a href="${project.projectLink}" target="_blank" class="secondary-button px-5 py-2 rounded-full text-sm inline-flex items-center gap-2">Live Demo <i data-lucide="external-link" class="h-3 w-3"></i></a>` : ''}
        </div>
    `;
    
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

// ========== DYNAMIC HERO FROM LOCALSTORAGE ==========
function loadHeroFromStorage() {
    const saved = localStorage.getItem('portfolio_hero');
    if (!saved) return;
    
    const hero = JSON.parse(saved);
    
    setTimeout(() => {
        const nameElement = document.getElementById('heroName');
        const titleElement = document.getElementById('heroTitle');
        const descriptionElement = document.getElementById('heroDescription');
        const taglineElement = document.querySelector('.glass.absolute .text-white');
        
        if (nameElement) nameElement.textContent = hero.name;
        if (titleElement) titleElement.textContent = hero.title;
        if (descriptionElement) descriptionElement.textContent = hero.description;
        if (taglineElement) taglineElement.textContent = hero.tagline;
    }, 200);
}

// ========== DYNAMIC SERVICES FROM LOCALSTORAGE ==========
function generateServiceCard(service, index) {
    const iconColorClass = index % 2 === 0
        ? 'bg-[#A855F7]/15 text-[#A855F7]'
        : 'bg-[#F472B6]/15 text-[#F472B6]';

    return `
        <article class="reveal visible service-card glass rounded-[2rem] p-7">
            <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${iconColorClass}">
                <i data-lucide="${escapeHtml(service.icon || 'code-2')}" class="h-7 w-7"></i>
            </div>
            <h3 class="text-xl font-bold">${escapeHtml(service.title || '')}</h3>
            <p class="mt-4 leading-7 text-zinc-400">${escapeHtml(service.description || '')}</p>
        </article>
    `;
}

function loadServicesFromStorage() {
    console.log('Entering loadServicesFromStorage');

    const saved = localStorage.getItem('portfolio_services');
    if (!saved) {
        console.log('No services data found in localStorage');
        return;
    }
    
    const servicesData = JSON.parse(saved);
    console.log('Loading services:', servicesData);

    const servicesSection = document.getElementById('services');
    if (!servicesSection) {
        console.log('Services section not found yet');
        return;
    }

    const sectionTitle = servicesSection.querySelector('h2');
    const sectionSubtitle = servicesSection.querySelector('.max-w-2xl');
    const servicesGrid = servicesSection.querySelector('.grid');
    
    console.log('Found section title:', sectionTitle);
    console.log('Found section subtitle:', sectionSubtitle);
    console.log('Found services grid:', servicesGrid);
    
    if (sectionTitle) sectionTitle.textContent = servicesData.sectionTitle || '';
    if (sectionSubtitle) sectionSubtitle.textContent = servicesData.sectionSubtitle || '';
    if (servicesGrid) {
        servicesGrid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';
        servicesGrid.innerHTML = (servicesData.services || [])
            .map((service, index) => generateServiceCard(service, index))
            .join('');
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========== DYNAMIC SKILLS FROM LOCALSTORAGE ==========
function getSkillsFromStorage() {
    const saved = localStorage.getItem('portfolio_skills');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultSkills = [
        { id: "skill_1", name: "HTML", icon: "code-2" },
        { id: "skill_2", name: "CSS", icon: "palette" },
        { id: "skill_3", name: "JavaScript", icon: "braces" },
        { id: "skill_4", name: "Tailwind CSS", icon: "wind" },
        { id: "skill_5", name: "Git/GitHub", icon: "git-branch" },
        { id: "skill_6", name: "Java", icon: "coffee" },
        { id: "skill_7", name: "Python", icon: "code-2" },
        { id: "skill_8", name: "Flutter", icon: "smartphone" },
        { id: "skill_9", name: "Figma", icon: "figma" }
    ];
    
    localStorage.setItem('portfolio_skills', JSON.stringify(defaultSkills));
    return defaultSkills;
}

function generateSkillPill(skill) {
    return `
        <span class="skill-pill inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-semibold text-white">
            <i data-lucide="${escapeHtml(skill.icon || 'code-2')}" class="h-4 w-4 text-[#F472B6]"></i>
            <span>${escapeHtml(skill.name || '')}</span>
        </span>
    `;
}

function loadSkillsFromStorage() {
    const skills = getSkillsFromStorage();
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const skillsList = skillsSection.querySelector('[data-skills-list]');
    if (!skillsList) return;
    
    skillsList.innerHTML = skills
        .map(skill => generateSkillPill(skill))
        .join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========== DYNAMIC CONTACT FROM LOCALSTORAGE ==========
function getContactFromStorage() {
    const saved = localStorage.getItem('portfolio_contact');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultContact = {
        email: "wmasha939@gmail.com",
        github: "https://github.com/Masha-debug217",
        linkedin: "https://www.linkedin.com/in/winnie-masha"
    };
    
    localStorage.setItem('portfolio_contact', JSON.stringify(defaultContact));
    return defaultContact;
}

function formatContactUrl(url) {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function loadContactFromStorage() {
    const contact = getContactFromStorage();
    const emailLink = document.querySelector('[data-contact-email]');
    const emailText = document.querySelector('[data-contact-email-text]');
    const githubLink = document.querySelector('[data-contact-github]');
    const githubText = document.querySelector('[data-contact-github-text]');
    const linkedinLink = document.querySelector('[data-contact-linkedin]');
    const linkedinText = document.querySelector('[data-contact-linkedin-text]');
    
    if (emailLink) emailLink.href = `mailto:${contact.email || ''}`;
    if (emailText) emailText.textContent = contact.email || '';
    
    if (githubLink) githubLink.href = contact.github || '#';
    if (githubText) githubText.textContent = formatContactUrl(contact.github);
    
    if (linkedinLink) linkedinLink.href = contact.linkedin || '#';
    if (linkedinText) linkedinText.textContent = formatContactUrl(contact.linkedin);
}

function attachModalTriggers() {
  document.querySelectorAll('[data-modal]').forEach(card => {
    if (card.dataset.modalReady === 'true') return;
    card.dataset.modalReady = 'true';

    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      const modalId = card.getAttribute('data-modal');
      openModal(modalId);
    });
  });
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
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
  
  attachModalTriggers();
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  console.log('🦋 Welcome to Winnie Macharia\'s portfolio!');
  console.log('✨ Pink butterfly with shimmering particles active');
  console.log('🎨 Light/Dark mode ready');
  console.log('📅 Loaded on:', new Date().toLocaleString());
  
  loadHeroFromStorage();
  loadServicesFromStorage();
  loadSkillsFromStorage();
  loadContactFromStorage();
  console.log('✅ Services loading attempted from initializeAfterLoad');
}

// ========== PINK BUTTERFLY ==========
function initButterflyEffect() {
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
initModalSystem();
loadAllSections();
initThemeToggle();
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

function initFloatingChat() {
  const chatButton = document.getElementById('chat-button');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-window-input');
  const chatSend = document.getElementById('chat-window-send');
  const chatMessages = document.getElementById('chat-window-messages');
  
  if (!chatButton || !chatWindow) return;
  
  chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput?.focus();
    }
  });
  
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingChat);
} else {
  setTimeout(initFloatingChat, 500);
}
