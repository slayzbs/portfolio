/* ==========================================
   THEME MANAGEMENT
   ========================================== */

const themeToggleLight = document.getElementById('theme-toggle-light');
const themeToggleDark = document.getElementById('theme-toggle-dark');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateActiveTheme(theme);
}

function updateActiveTheme(theme) {
    if (themeToggleLight) {
        themeToggleLight.classList.toggle('active', theme === 'light');
    }
    if (themeToggleDark) {
        themeToggleDark.classList.toggle('active', theme === 'dark');
    }
}

// Event listeners
themeToggleLight?.addEventListener('click', () => setTheme('light'));
themeToggleDark?.addEventListener('click', () => setTheme('dark'));

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateActiveTheme(savedTheme);

/* ==========================================
   NAVIGATION
   ========================================== */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#site-nav .nav-link[href^="#"]');

// Active section highlighting
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`#site-nav .nav-link[href="#${entry.target.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, {
    rootMargin: '-40% 0px -60% 0px'
});

sections.forEach(section => observer.observe(section));

// Smooth scrolling
document.querySelectorAll('#site-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ==========================================
   HIDE/SHOW NAVIGATION ON SCROLL
   ========================================== */

let lastScroll = 0;
const nav = document.getElementById('site-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100 && currentScroll > lastScroll) {
        nav?.classList.add('nav-hidden');
    } else {
        nav?.classList.remove('nav-hidden');
    }
    
    lastScroll = currentScroll;
}, { passive: true });

/* ==========================================
   BACK TO TOP BUTTON
   ========================================== */

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    }
}, { passive: true });

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   NAME CHARACTER ANIMATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.name-char').forEach((char, index) => {
        char.style.animationDelay = `${index * 0.06}s`;
        char.classList.add('fade-in');
    });
});

/* ==========================================
   READING PROGRESS BAR
   ========================================== */

const readingProgress = document.getElementById('reading-progress');

const updateReadingProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    if (readingProgress) {
        readingProgress.style.width = `${progress}%`;
    }
};

window.addEventListener('scroll', updateReadingProgress, { passive: true });

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */

if ('IntersectionObserver' in window) {
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.fade-in, .slide-up').forEach(element => {
            animObserver.observe(element);
        });
    });
}

/* ==========================================
   PROJECTS DATA
   ========================================== */

const projects = [
    {
        number: '01',
        title: 'Example',
        tech: 'go',
        description: 'Blablabla',
        github: 'https://github.com/slayzbs/',
        liveUrl: 'https://',
        stars: 456
    },
    {
        number: '02',
        title: 'Example',
        tech: 'c#, python',
        description: 'Blablabla',
        github: 'https://github.com/slayzbs/',
        stars: 54
    }
];

/* ==========================================
   RENDER PROJECTS
   ========================================== */

const projectsGrid = document.querySelector('.projects-grid');

projects.forEach((project, index) => {
    const projectEl = document.createElement('div');
    projectEl.className = 'project slide-up';
    projectEl.style.animationDelay = `${index * 0.1}s`;

    // Build live site link if exists
    const liveSiteLink = project.liveUrl 
        ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">live site</a>` 
        : '';

    projectEl.innerHTML = `
        <div class="project-number">${project.number}</div>
        <div class="project-content">
            <div class="project-info">
                <div class="project-meta">
                    <span class="project-tech">${project.tech}</span>
                </div>
                <h3>${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">github</a>
                    ${liveSiteLink}
                    <span class="star-badge" aria-label="${project.stars} stars" data-github="${project.github}" data-stars="${project.stars}" data-role="star-badge">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.335 24 12 19.897 4.665 24l1.634-8.694L.6 9.75l7.732-1.732z"></path>
                        </svg>
                        <span class="star-count">${project.stars}</span>
                    </span>
                </div>
            </div>
        </div>
    `;

    projectsGrid.appendChild(projectEl);
});

/* ==========================================
   GITHUB STARS HYDRATION
   ========================================== */

if (typeof window !== 'undefined') {
    const CACHE_TTL = 1000 * 60 * 15; // 15 minutes
    const STORAGE_KEY = 'project-star-cache';

    const readCache = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    };

    const writeCache = (cache) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
        } catch {
            // Ignore quota errors
        }
    };

    const parseRepo = (githubUrl) => {
        try {
            const { pathname } = new URL(githubUrl);
            const parts = pathname.split('/').filter(Boolean);
            if (parts.length < 2) return null;
            return { owner: parts[0], repo: parts[1] };
        } catch {
            return null;
        }
    };

    const updateBadge = (badge, stars) => {
        const countEl = badge.querySelector('.star-count');
        badge.dataset.stars = String(stars);
        badge.setAttribute('aria-label', `${stars} stars`);
        if (countEl) {
            countEl.textContent = String(stars);
        }
    };

    const hydrateStars = async () => {
        const badges = Array.from(
            document.querySelectorAll('[data-role="star-badge"][data-github]')
        );

        if (!badges.length) return;

        const cache = readCache();
        const now = Date.now();

        for (const badge of badges) {
            const github = badge.getAttribute('data-github');
            if (!github) continue;

            const cached = cache[github];
            if (cached && now - cached.ts < CACHE_TTL) {
                updateBadge(badge, cached.stars);
                continue;
            }

            const parsed = parseRepo(github);
            if (!parsed) continue;

            try {
                const res = await fetch(
                    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`
                );
                if (!res.ok) continue;
                
                const data = await res.json();
                const stars = Number(data?.stargazers_count ?? 0);
                
                if (Number.isFinite(stars)) {
                    updateBadge(badge, stars);
                    cache[github] = { stars, ts: now };
                    writeCache(cache);
                }
            } catch {
                // Ignore fetch errors
            }
        }
    };

    // Run hydration when page loads
    if (document.readyState === 'complete') {
        hydrateStars();
    } else {
        window.addEventListener('load', hydrateStars, { once: true });
    }
}

/* ==========================================
   CONTACT FORM
   ========================================== */

const contactForm = document.getElementById('contact-form');
const notification = document.getElementById('notification');

if (contactForm && notification) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success notification
        notification.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        notification.className = 'notification notification-success';
        notification.style.display = 'block';

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);

        // Reset form
        contactForm.reset();
    });
}
