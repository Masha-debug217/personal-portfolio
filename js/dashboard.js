// ========== AUTHENTICATION ==========
const ADMIN_PASSWORD = "admin123";
let currentEditId = null;

function login() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        loadProjects();
        updateStats();
        loadHeroToDashboard();
        loadServicesToDashboard();
        loadSkillsToDashboard();
        loadContactToDashboard();
    } else {
        document.getElementById('errorMsg').style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('isAdmin');
    location.reload();
}

// Check if already logged in
if (localStorage.getItem('isAdmin') === 'true') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    loadProjects();
    updateStats();
    loadHeroToDashboard();
    loadServicesToDashboard();
    loadSkillsToDashboard();
    loadContactToDashboard();
}

// ========== HERO CONTENT MANAGEMENT ==========

function getHeroContent() {
    const saved = localStorage.getItem('portfolio_hero');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultHero = {
        name: "Winnie Macharia",
        title: "Software Developer & AI Enthusiast",
        tagline: "Design-minded developer",
        description: "I build web experiences that work, from full-stack trading platforms to mobile health apps. I focus on clean code, thoughtful UX, and solving real problems."
    };
    
    localStorage.setItem('portfolio_hero', JSON.stringify(defaultHero));
    return defaultHero;
}

function saveHeroContent() {
    const heroContent = {
        name: document.getElementById('heroName').value,
        title: document.getElementById('heroTitle').value,
        tagline: document.getElementById('heroTagline').value,
        description: document.getElementById('heroDescription').value
    };
    
    localStorage.setItem('portfolio_hero', JSON.stringify(heroContent));
    alert('Hero section updated! Refresh your portfolio to see changes.');
}

function loadHeroToDashboard() {
    const hero = getHeroContent();
    const nameInput = document.getElementById('heroName');
    const titleInput = document.getElementById('heroTitle');
    const taglineInput = document.getElementById('heroTagline');
    const descInput = document.getElementById('heroDescription');
    
    if (nameInput) nameInput.value = hero.name;
    if (titleInput) titleInput.value = hero.title;
    if (taglineInput) taglineInput.value = hero.tagline;
    if (descInput) descInput.value = hero.description;
}

// ========== SERVICES CONTENT MANAGEMENT ==========

function getServicesContent() {
    const saved = localStorage.getItem('portfolio_services');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultServices = {
        sectionTitle: "What I love building",
        sectionSubtitle: "Practical, polished digital products with a balance of functionality, usability, and beautiful visuals.",
        services: [
            {
                id: "service_1",
                icon: "monitor-smartphone",
                title: "Web Development",
                description: "Responsive websites and web apps built with clean structure and modern interaction patterns."
            },
            {
                id: "service_2",
                icon: "pen-tool",
                title: "UI/UX Design",
                description: "Elegant user interfaces with clear information architecture and accessible design thinking."
            },
            {
                id: "service_3",
                icon: "layout-template",
                title: "Frontend Development",
                description: "Pixel-aware frontend builds with smooth animations, reusable layouts, and mobile-first styling."
            }
        ]
    };
    
    localStorage.setItem('portfolio_services', JSON.stringify(defaultServices));
    return defaultServices;
}

function saveServicesContent() {
    const sectionTitle = document.getElementById('servicesSectionTitle').value;
    const sectionSubtitle = document.getElementById('servicesSectionSubtitle').value;
    
    const serviceCards = document.querySelectorAll('.service-editor-card');
    const services = [];
    
    serviceCards.forEach((card, index) => {
        const serviceId = card.dataset.serviceId || `service_${Date.now()}_${index}`;
        const titleInput = card.querySelector('.service-title-input');
        const descInput = card.querySelector('.service-desc-input');
        const iconSelect = card.querySelector('.service-icon-select');
        
        services.push({
            id: serviceId,
            icon: iconSelect ? iconSelect.value : "code-2",
            title: titleInput ? titleInput.value : "",
            description: descInput ? descInput.value : ""
        });
    });
    
    const servicesContent = {
        sectionTitle: sectionTitle,
        sectionSubtitle: sectionSubtitle,
        services: services
    };
    
    localStorage.setItem('portfolio_services', JSON.stringify(servicesContent));
    alert('Services section updated! Refresh your portfolio to see changes.');
}

function loadServicesToDashboard() {
    const services = getServicesContent();
    
    const titleInput = document.getElementById('servicesSectionTitle');
    const subtitleInput = document.getElementById('servicesSectionSubtitle');
    
    if (titleInput) titleInput.value = services.sectionTitle;
    if (subtitleInput) subtitleInput.value = services.sectionSubtitle;
    
    const container = document.getElementById('servicesListContainer');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < services.services.length; i++) {
        const service = services.services[i];
        html += `
            <div class="service-editor-card bg-gray-50 rounded-md p-4 border border-gray-200" data-service-id="${service.id}">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-medium text-gray-700">Service ${i + 1}</h3>
                    <button onclick="removeService('${service.id}')" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <select class="service-icon-select w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="monitor-smartphone" ${service.icon === 'monitor-smartphone' ? 'selected' : ''}>Monitor/Smartphone</option>
                            <option value="pen-tool" ${service.icon === 'pen-tool' ? 'selected' : ''}>Pen Tool</option>
                            <option value="layout-template" ${service.icon === 'layout-template' ? 'selected' : ''}>Layout Template</option>
                            <option value="code-2" ${service.icon === 'code-2' ? 'selected' : ''}>Code</option>
                            <option value="globe" ${service.icon === 'globe' ? 'selected' : ''}> Globe</option>
                            <option value="database" ${service.icon === 'database' ? 'selected' : ''}>Database</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" class="service-title-input w-full px-3 py-2 border border-gray-300 rounded-md" value="${escapeHtml(service.title)}">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea class="service-desc-input w-full px-3 py-2 border border-gray-300 rounded-md" rows="2">${escapeHtml(service.description)}</textarea>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function addNewService() {
    const services = getServicesContent();
    const newService = {
        id: 'service_' + Date.now(),
        icon: 'code-2',
        title: 'New Service',
        description: 'Describe this service...'
    };
    services.services.push(newService);
    localStorage.setItem('portfolio_services', JSON.stringify(services));
    loadServicesToDashboard();
}

function removeService(serviceId) {
    if (confirm('Remove this service?')) {
        const services = getServicesContent();
        services.services = services.services.filter(s => s.id !== serviceId);
        localStorage.setItem('portfolio_services', JSON.stringify(services));
        loadServicesToDashboard();
    }
}



function getDefaultSkills() {
    return [
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
}

function getSkillsContent() {
    const saved = localStorage.getItem('portfolio_skills');
    if (saved) {
        return JSON.parse(saved);
    }
    
    const defaultSkills = getDefaultSkills();
    localStorage.setItem('portfolio_skills', JSON.stringify(defaultSkills));
    return defaultSkills;
}

function collectSkillsFromDashboard() {
    const skillCards = document.querySelectorAll('.skill-editor-card');
    const skills = [];
    
    skillCards.forEach((card, index) => {
        const skillId = card.dataset.skillId || `skill_${Date.now()}_${index}`;
        const nameInput = card.querySelector('.skill-name-input');
        const iconSelect = card.querySelector('.skill-icon-select');
        
        skills.push({
            id: skillId,
            name: nameInput ? nameInput.value : "",
            icon: iconSelect ? iconSelect.value : "code-2"
        });
    });
    
    return skills;
}

function saveSkillsContent() {
    const skills = collectSkillsFromDashboard();
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
    alert('Skills section updated! Refresh your portfolio to see changes.');
}

function loadSkillsToDashboard() {
    const skills = getSkillsContent();
    const container = document.getElementById('skillsListContainer');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        html += `
            <div class="skill-editor-card bg-gray-50 rounded-md p-4 border border-gray-200" data-skill-id="${skill.id}">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-medium text-gray-700">Skill ${i + 1}</h3>
                    <button onclick="removeSkill('${skill.id}')" class="text-red-500 hover:text-red-700 text-sm">Remove</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <select class="skill-icon-select w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="code-2" ${skill.icon === 'code-2' ? 'selected' : ''}>{ } Code</option>
                            <option value="palette" ${skill.icon === 'palette' ? 'selected' : ''}>Palette</option>
                            <option value="braces" ${skill.icon === 'braces' ? 'selected' : ''}>Braces</option>
                            <option value="wind" ${skill.icon === 'wind' ? 'selected' : ''}>Wind</option>
                            <option value="git-branch" ${skill.icon === 'git-branch' ? 'selected' : ''}>Git Branch</option>
                            <option value="coffee" ${skill.icon === 'coffee' ? 'selected' : ''}>Coffee</option>
                            <option value="smartphone" ${skill.icon === 'smartphone' ? 'selected' : ''}>Smartphone</option>
                            <option value="figma" ${skill.icon === 'figma' ? 'selected' : ''}>Figma</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                        <input type="text" class="skill-name-input w-full px-3 py-2 border border-gray-300 rounded-md" value="${escapeHtml(skill.name)}">
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function addNewSkill() {
    const skills = collectSkillsFromDashboard();
    const currentSkills = skills.length ? skills : getSkillsContent();
    
    currentSkills.push({
        id: 'skill_' + Date.now(),
        name: 'New Skill',
        icon: 'code-2'
    });
    
    localStorage.setItem('portfolio_skills', JSON.stringify(currentSkills));
    loadSkillsToDashboard();
}

function removeSkill(skillId) {
    if (confirm('Remove this skill?')) {
        const skills = collectSkillsFromDashboard()
            .filter(skill => skill.id !== skillId);
        localStorage.setItem('portfolio_skills', JSON.stringify(skills));
        loadSkillsToDashboard();
    }
}



function getContactContent() {
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

function saveContactContent() {
    const contactContent = {
        email: document.getElementById('contactEmail').value,
        github: document.getElementById('contactGithub').value,
        linkedin: document.getElementById('contactLinkedin').value
    };
    
    localStorage.setItem('portfolio_contact', JSON.stringify(contactContent));
    alert('Contact section updated! Refresh your portfolio to see changes.');
}

function loadContactToDashboard() {
    const contact = getContactContent();
    const emailInput = document.getElementById('contactEmail');
    const githubInput = document.getElementById('contactGithub');
    const linkedinInput = document.getElementById('contactLinkedin');
    
    if (emailInput) emailInput.value = contact.email;
    if (githubInput) githubInput.value = contact.github;
    if (linkedinInput) linkedinInput.value = contact.linkedin;
}



function getProjects() {
    const savedProjects = localStorage.getItem('portfolio_projects');
    
    if (savedProjects) {
        return JSON.parse(savedProjects);
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

function saveProjects(projects) {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    updateStats();
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

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getLastDateKeys(dayCount) {
    const dates = [];
    
    for (let i = dayCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(getLocalDateKey(date));
    }
    
    return dates;
}

function getProjectAnalytics() {
    const projects = getProjects();
    const stats = getProjectClickStats();
    const last7DateKeys = getLastDateKeys(7);
    const analyticsByProject = {};
    const dailyRows = [];
    
    projects.forEach(project => {
        analyticsByProject[project.id] = {
            id: project.id,
            title: project.title,
            modal: 0,
            figma: 0,
            total: 0,
            last7: 0
        };
    });
    
    Object.keys(stats).sort().forEach(dateKey => {
        const dayStats = stats[dateKey];
        let dayModal = 0;
        let dayFigma = 0;
        
        Object.keys(dayStats).forEach(projectId => {
            const projectStats = dayStats[projectId] || {};
            const modalClicks = projectStats.modal || 0;
            const figmaClicks = projectStats.figma || 0;
            const projectAnalytics = analyticsByProject[projectId] || {
                id: projectId,
                title: projectId,
                modal: 0,
                figma: 0,
                total: 0,
                last7: 0
            };
            
            projectAnalytics.modal += modalClicks;
            projectAnalytics.figma += figmaClicks;
            projectAnalytics.total += modalClicks + figmaClicks;
            
            if (last7DateKeys.includes(dateKey)) {
                projectAnalytics.last7 += modalClicks + figmaClicks;
            }
            
            analyticsByProject[projectId] = projectAnalytics;
            dayModal += modalClicks;
            dayFigma += figmaClicks;
        });
        
        dailyRows.push({
            date: dateKey,
            modal: dayModal,
            figma: dayFigma,
            total: dayModal + dayFigma
        });
    });
    
    const projectsAnalytics = Object.values(analyticsByProject)
        .sort((a, b) => b.total - a.total);
    
    const allTimeTotal = projectsAnalytics.reduce((sum, item) => sum + item.total, 0);
    const last7Total = projectsAnalytics.reduce((sum, item) => sum + item.last7, 0);
    const modalTotal = projectsAnalytics.reduce((sum, item) => sum + item.modal, 0);
    const figmaTotal = projectsAnalytics.reduce((sum, item) => sum + item.figma, 0);
    
    return {
        projectsAnalytics,
        dailyRows: dailyRows.reverse(),
        allTimeTotal,
        last7Total,
        modalTotal,
        figmaTotal
    };
}

function renderAnalytics() {
    const container = document.getElementById('analyticsContainer');
    if (!container) return;
    
    const analytics = getProjectAnalytics();
    
    if (analytics.allTimeTotal === 0) {
        container.innerHTML = '<div class="text-gray-500 text-sm">No click data yet. Click project cards or Figma links on the portfolio to populate analytics.</div>';
        return;
    }
    
    const topProjectsHtml = analytics.projectsAnalytics
        .filter(project => project.total > 0)
        .map(project => `
            <div class="flex items-center justify-between border-b border-gray-100 py-3">
                <div>
                    <div class="font-medium text-gray-800">${escapeHtml(project.title)}</div>
                    <div class="text-xs text-gray-500">Modal: ${project.modal} | Figma: ${project.figma} | Last 7 days: ${project.last7}</div>
                </div>
                <div class="text-lg font-semibold text-purple-600">${project.total}</div>
            </div>
        `)
        .join('');
    
    const dailyHtml = analytics.dailyRows
        .filter(day => day.total > 0)
        .slice(0, 7)
        .map(day => `
            <tr class="border-t border-gray-100">
                <td class="py-2 pr-3 text-gray-700">${day.date}</td>
                <td class="py-2 px-3 text-gray-700">${day.modal}</td>
                <td class="py-2 px-3 text-gray-700">${day.figma}</td>
                <td class="py-2 pl-3 font-medium text-gray-900">${day.total}</td>
            </tr>
        `)
        .join('');
    
    container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-50 rounded-md p-4">
                <div class="text-xs text-gray-500">All-Time Clicks</div>
                <div class="text-2xl font-semibold text-gray-800">${analytics.allTimeTotal}</div>
            </div>
            <div class="bg-gray-50 rounded-md p-4">
                <div class="text-xs text-gray-500">Last 7 Days</div>
                <div class="text-2xl font-semibold text-gray-800">${analytics.last7Total}</div>
            </div>
            <div class="bg-gray-50 rounded-md p-4">
                <div class="text-xs text-gray-500">Modal Opens</div>
                <div class="text-2xl font-semibold text-gray-800">${analytics.modalTotal}</div>
            </div>
            <div class="bg-gray-50 rounded-md p-4">
                <div class="text-xs text-gray-500">Figma Clicks</div>
                <div class="text-2xl font-semibold text-gray-800">${analytics.figmaTotal}</div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 class="font-medium text-gray-800 mb-2">Most Clicked Projects</h3>
                <div class="border border-gray-100 rounded-md px-4">
                    ${topProjectsHtml}
                </div>
            </div>
            
            <div>
                <h3 class="font-medium text-gray-800 mb-2">Daily Breakdown</h3>
                <div class="overflow-x-auto border border-gray-100 rounded-md">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-left text-gray-500 bg-gray-50">
                                <th class="py-2 pr-3 pl-4 font-medium">Date</th>
                                <th class="py-2 px-3 font-medium">Modal</th>
                                <th class="py-2 px-3 font-medium">Figma</th>
                                <th class="py-2 pl-3 pr-4 font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dailyHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function updateStats() {
    const projects = getProjects();
    const analytics = getProjectAnalytics();
    const totalElement = document.getElementById('totalProjects');
    const clicksElement = document.getElementById('totalClicks');
    const updatedElement = document.getElementById('lastUpdated');
    
    if (totalElement) {
        totalElement.textContent = projects.length;
    }
    
    if (clicksElement) {
        clicksElement.textContent = analytics.allTimeTotal;
    }
    
    if (updatedElement) {
        const now = new Date();
        updatedElement.textContent = now.toLocaleTimeString();
    }
    
    renderAnalytics();
}

// ========== DISPLAY PROJECTS ==========

function loadProjects() {
    const projects = getProjects();
    const analyticsByProject = getProjectAnalytics().projectsAnalytics
        .reduce((acc, project) => {
            acc[project.id] = project;
            return acc;
        }, {});
    const container = document.getElementById('projectsContainer');
    
    if (!container) return;
    
    let htmlContent = '';
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                No projects yet. Add your first project above! 🚀
            </div>
        `;
        return;
    }
    
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectAnalytics = analyticsByProject[project.id] || { total: 0, modal: 0, figma: 0, last7: 0 };
        
        htmlContent = htmlContent + `
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-lg text-gray-800">${escapeHtml(project.title)}</h3>
                        <p class="text-gray-600 text-sm mt-1">${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</p>
                        <div class="flex flex-wrap gap-1 mt-2">
                            ${project.technologies.map(tech => `<span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">${escapeHtml(tech)}</span>`).join('')}
                        </div>
                        <div class="text-xs text-gray-400 mt-2">
                            📅 ${project.dateAdded} | 👆 ${project.clickCount || 0} clicks
                        </div>
                    </div>
                        <div class="text-xs text-purple-600 mt-1">
                            Analytics: ${projectAnalytics.total} all-time | ${projectAnalytics.modal} modal | ${projectAnalytics.figma} Figma | ${projectAnalytics.last7} last 7 days
                        </div>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <button onclick="editProject('${project.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors cursor-pointer">
                            Edit
                        </button>
                        <button onclick="deleteProject('${project.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors cursor-pointer">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = htmlContent;
    updateStats();
}

// ========== CRUD OPERATIONS ==========

function setupFormHandler() {
    const form = document.getElementById('projectForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const projectLink = document.getElementById('projectLink').value;
        const githubLink = document.getElementById('githubLink').value;
        const techString = document.getElementById('technologies').value;
        
        let technologies = [];
        if (techString) {
            technologies = techString.split(',').map(function(tech) {
                return tech.trim();
            });
        }
        
        if (currentEditId !== null) {
            const projects = getProjects();
            
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].id === currentEditId) {
                    projects[i].title = title;
                    projects[i].description = description;
                    projects[i].imageUrl = imageUrl;
                    projects[i].projectLink = projectLink;
                    projects[i].githubLink = githubLink;
                    projects[i].technologies = technologies;
                    break;
                }
            }
            
            saveProjects(projects);
            alert('Project updated successfully!');
            
            currentEditId = null;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Add Project';
            }
            
        } else {
            const newProject = {
                id: 'project_' + Date.now(),
                title: title,
                description: description,
                imageUrl: imageUrl,
                projectLink: projectLink,
                githubLink: githubLink,
                technologies: technologies,
                dateAdded: new Date().toISOString().split('T')[0],
                clickCount: 0
            };
            
            const currentProjects = getProjects();
            currentProjects.push(newProject);
            saveProjects(currentProjects);
            alert('Project added successfully!');
        }
        
        loadProjects();
        form.reset();
    });
}

function editProject(projectId) {
    const projects = getProjects();
    
    let projectToEdit = null;
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === projectId) {
            projectToEdit = projects[i];
            break;
        }
    }
    
    if (!projectToEdit) {
        alert('Project not found');
        return;
    }
    
    document.getElementById('title').value = projectToEdit.title;
    document.getElementById('description').value = projectToEdit.description;
    document.getElementById('imageUrl').value = projectToEdit.imageUrl || '';
    document.getElementById('projectLink').value = projectToEdit.projectLink || '';
    document.getElementById('githubLink').value = projectToEdit.githubLink || '';
    document.getElementById('technologies').value = projectToEdit.technologies.join(', ');
    
    currentEditId = projectId;
    
    const form = document.getElementById('projectForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Update Project';
    }
    
    form.scrollIntoView({ behavior: 'smooth' });
}

function deleteProject(projectId) {
    const confirmed = confirm('Are you sure you want to delete this project?');
    
    if (!confirmed) {
        return;
    }
    
    const projects = getProjects();
    
    let indexToDelete = -1;
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === projectId) {
            indexToDelete = i;
            break;
        }
    }
    
    if (indexToDelete !== -1) {
        projects.splice(indexToDelete, 1);
        saveProjects(projects);
        loadProjects();
        alert('Project deleted successfully!');
    }
}

// ========== HELPER FUNCTIONS ==========

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== INITIALIZE ==========
setupFormHandler();
