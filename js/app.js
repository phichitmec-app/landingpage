/* ============================================
   MEC PHICHIT — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  initThemeToggle();
  initSamoModal();

  try {
    // Load content dynamically from content.json
    await loadContentDatabase();
  } catch (err) {
    console.error('Error loading content database:', err);
  }

  initNavigation();
  initScrollReveal();
  initParticles();
  initCounters();
  initSmoothScroll();
  initActiveNavHighlight();
  initTributeModal();
  initGallerySlider();
  initAboutModal();
  initFloatingControls();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-cta');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close on overlay click
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function closeMenu() {
    navLinks.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   ACTIVE NAV HIGHLIGHT
   ============================================ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let currentSectionId = 'hero';
    const scrollPosition = window.scrollY + 150; // offset for navbar height + buffer

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      let targetHref = `#${currentSectionId}`;
      if (currentSectionId === 'programs') {
        targetHref = '#about';
      } else if (currentSectionId === 'gallery') {
        targetHref = '#hero';
      }
      if (item.getAttribute('href') === targetHref) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 15000), 80);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '0, 212, 170' : '0, 180, 216'
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 212, 170, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  // Use Intersection Observer to pause when not visible
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) drawParticles();
        } else {
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        }
      });
    }, { threshold: 0 });
    visibilityObserver.observe(heroSection);
  }

  resize();
  createParticles();
  drawParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 250);
  });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const countRaw = el.dataset.count || '';
  const target = parseInt(countRaw, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  const suffixHtml = suffix ? `<span class="stat-suffix">${suffix}</span>` : '';
  const prefixHtml = prefix ? `<span class="stat-prefix">${prefix}</span>` : '';

  // If the target is not a valid number (e.g. text/word), display it directly without animation
  if (isNaN(target)) {
    el.innerHTML = prefixHtml + countRaw + suffixHtml;
    return;
  }

  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.innerHTML = prefixHtml + current.toLocaleString() + suffixHtml;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.innerHTML = prefixHtml + target.toLocaleString() + suffixHtml;
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   THEME TOGGLE (Dark / Light)
   ============================================ */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const iconEl = toggleBtn.querySelector('.theme-toggle-icon');
  const root = document.documentElement;

  // Determine initial theme
  const savedTheme = localStorage.getItem('mec-theme');
  const initialTheme = savedTheme || 'light'; // default light

  applyTheme(initialTheme, false);

  // Toggle on click
  toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('mec-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });

  function applyTheme(theme, animate) {
    // Enable transition animation
    if (animate) {
      document.body.classList.add('theme-transitioning');
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 500);
    }

    // Apply theme attribute
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    // Update icon
    if (iconEl) {
      iconEl.textContent = theme === 'light' ? '☀️' : '🌙';
    }

    // Save preference
    localStorage.setItem('mec-theme', theme);

    // Update Instagram embeds to match current theme
    updateInstagramEmbedThemes();

    // Re-initialize particles with correct colors after a brief delay
    if (animate) {
      setTimeout(() => {
        initParticles();
      }, 100);
    }
  }
}

/* ============================================
   TRIBUTE POPUP MODAL
   ============================================ */
function initTributeModal() {
  const modal = document.getElementById('tribute-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('tribute-modal-close');
  const enterBtn = document.getElementById('tribute-enter-btn');
  const overlay = modal.querySelector('.tribute-modal-overlay');

  // Check sessionStorage so it only shows once per browser tab session
  const isShown = sessionStorage.getItem('mec-tribute-shown');

  if (!isShown) {
    // Show modal after a small delay for smooth intro
    setTimeout(() => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }, 800);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sessionStorage.setItem('mec-tribute-shown', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (enterBtn) enterBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================
   ATMOSPHERE GALLERY SLIDER
   ============================================ */
function initGallerySlider() {
  const container = document.querySelector('.slider-container');
  if (!container) return;

  const slides = container.querySelectorAll('.slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const indicators = container.querySelectorAll('.indicator');
  let currentSlide = 0;
  let slideInterval;
  let isHovered = false;
  let isTransitioning = false;
  const SLIDE_DURATION = 10000;
  const THROTTLE_TIME = 1200; // ms (must match CSS transition duration)

  function showSlide(index) {
    if (slides.length === 0 || isTransitioning) return;

    const targetSlide = (index + slides.length) % slides.length;
    if (targetSlide === currentSlide) return;

    isTransitioning = true;

    // Toggle active classes
    slides[currentSlide].classList.remove('active');
    slides[targetSlide].classList.add('active');

    // Update index
    currentSlide = targetSlide;

    // Update active indicator
    indicators.forEach((ind, idx) => {
      ind.classList.toggle('active', idx === currentSlide);
    });

    // Release throttle after transition completes (1.2s)
    setTimeout(() => {
      isTransitioning = false;
    }, THROTTLE_TIME);
  }

  function nextSlide() { showSlide(currentSlide + 1); }
  function prevSlide() { showSlide(currentSlide - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => { showSlide(idx); resetAutoplay(); });
  });

  function startAutoplay() {
    clearInterval(slideInterval);
    if (!isHovered) slideInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function resetAutoplay() { startAutoplay(); }

  container.addEventListener('mouseenter', () => { isHovered = true; clearInterval(slideInterval); });
  container.addEventListener('mouseleave', () => { isHovered = false; startAutoplay(); });

  // Touch swipe support
  let startX = 0;
  container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  // Initialize first slide as active
  if (slides.length > 0) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === 0);
    });
  }

  startAutoplay();
}

/* ============================================
   LOAD CONTENT DATABASE (JSON)
   ============================================ */
async function loadContentDatabase() {
  const res = await fetch('data/content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load JSON');
  const data = await res.json();

  // Helper to set text content
  const setTxt = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // Helper to set HTML content
  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  // Helper to set image source/alt
  const setImg = (id, src, alt) => {
    const el = document.getElementById(id);
    if (el) {
      if (src) el.src = src;
      if (alt) el.alt = alt;
    }
  };

  // Logo & Branding
  if (data.logo) {
    setImg('nav-logo-img', data.logo.src, data.logo.alt);
    setTxt('nav-brand-name', data.logo.name);
    setTxt('nav-brand-sub', data.logo.sub);
    setImg('footer-logo-img', data.logo.src, data.logo.alt);
    setTxt('footer-brand-name', data.logo.name);
    setTxt('footer-brand-sub', data.logo.sub);
  }

  // Tribute
  if (data.tribute) {
    setImg('tribute-image', data.tribute.src, data.tribute.alt);
  }

  // Hero Section
  if (data.hero) {
    setTxt('hero-badge-text', data.hero.badge);
    setTxt('hero-title-line1', data.hero.title_line1);
    setHtml('hero-title-line2', data.hero.title_line2);
    setTxt('hero-subtitle', data.hero.subtitle);

    const ctaAboutText = document.getElementById('hero-cta-about');
    if (ctaAboutText) {
      const txtNode = ctaAboutText.firstChild;
      if (txtNode && txtNode.nodeType === Node.TEXT_NODE) {
        txtNode.textContent = data.hero.cta_about + ' ';
      } else {
        setHtml('hero-cta-about', `${data.hero.cta_about} <span class="btn-icon" aria-hidden="true">→</span>`);
      }
    }
    const ctaContact = document.getElementById('hero-cta-contact-text');
    if (ctaContact) ctaContact.textContent = data.hero.cta_contact;

    // Hero stats
    const heroStatsContainer = document.getElementById('hero-stats');
    if (heroStatsContainer && data.hero.stats) {
      heroStatsContainer.innerHTML = data.hero.stats.map(stat => `
        <div class="hero-stat">
          <div class="hero-stat-number" data-count="${stat.number}" data-suffix="${stat.suffix}">0</div>
          <div class="hero-stat-label">${stat.label}</div>
        </div>
      `).join('');
    }
  }

  // Gallery
  const sliderWrapper = document.getElementById('slider-wrapper');
  const sliderIndicators = document.getElementById('slider-indicators');
  if (sliderWrapper && data.gallery) {
    sliderWrapper.innerHTML = data.gallery.map((img, idx) => {
      const zoomClass = img.zoom === false ? 'no-zoom' : '';
      const focalStyle = img.focal_point ? `style="object-position: ${img.focal_point};"` : '';
      return `
        <div class="slide ${idx === 0 ? 'active' : ''}">
          <img src="${img.src}" alt="${img.alt}" class="slide-img ${zoomClass}" ${focalStyle}>
        </div>
      `;
    }).join('');
  }
  if (sliderIndicators && data.gallery) {
    sliderIndicators.innerHTML = data.gallery.map((_, idx) => `
      <span class="indicator ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>
    `).join('');
  }

  // About Section
  if (data.about) {
    const visualContainer = document.getElementById('about-visual-container');
    if (visualContainer) {
      visualContainer.innerHTML = '';
      const src = data.about.visual_image || "";
      const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('video/');
      if (isVideo) {
        const video = document.createElement('video');
        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        visualContainer.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = data.about.visual_title || "ศูนย์แพทยศาสตรศึกษาชั้นคลินิก โรงพยาบาลพิจิตร";
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        visualContainer.appendChild(img);
      }
    }
    setTxt('about-float-icon', data.about.float_icon);
    setTxt('about-float-title', data.about.float_title);
    setTxt('about-float-detail', data.about.float_detail);

    const aboutBadge = document.getElementById('about-badge');
    if (aboutBadge) aboutBadge.innerHTML = `<span class="badge-dot" aria-hidden="true"></span>${data.about.badge}`;

    setHtml('about-title', `${data.about.title_line1}<br><span class="accent-text">${data.about.title_line2}</span>`);
    setHtml('about-p1', data.about.paragraph1);
    setHtml('about-p2', data.about.paragraph2);
    setTxt('about-vision-title', data.about.vision_title);
    setTxt('about-vision-text', data.about.vision_text);
    setTxt('about-mission-title', data.about.mission_title);
    setTxt('about-mission-text', data.about.mission_text);

    // Save full history details on the trigger button
    const historyTrigger = document.getElementById('about-history-trigger');
    if (historyTrigger) {
      historyTrigger.dataset.title = data.about.float_title || "ประวัติความเป็นมา";
      historyTrigger.dataset.icon = data.about.float_icon || "🎓";
      historyTrigger.dataset.body = data.about.history_full || "";
      historyTrigger.dataset.image = data.about.history_image || "";
    }

    // Parse and populate mission bullets dynamically
    const missionList = document.getElementById('about-mission-list');
    if (missionList && data.about.mission_full) {
      const items = data.about.mission_full.split('\n').filter(line => line.trim() !== '');
      missionList.innerHTML = items.map(item => {
        const cleanText = item.replace(/^\d+\.\s*/, '').trim();
        return `
          <li>
            <span class="mission-bullet-dot"></span>
            <span class="mission-bullet-text">${cleanText}</span>
          </li>
        `;
      }).join('');
    }
  }

  // Stats Bar
  const statsBarGrid = document.getElementById('stats-bar-grid');
  if (statsBarGrid && data.stats_bar) {
    statsBarGrid.innerHTML = data.stats_bar.map(stat => {
      const labelFormatted = stat.label
        ? stat.label.split(' ').map(word => `<span>${word}</span>`).join(' ')
        : '';
      const sublabelFormatted = stat.sublabel
        ? stat.sublabel.split(' ').map(word => `<span>${word}</span>`).join(' ')
        : '';
      return `
        <div class="stat-item">
          <div class="stat-number" data-count="${stat.number}" data-suffix="${stat.suffix}">0</div>
          <div class="stat-label">${labelFormatted}</div>
          <div class="stat-sublabel">${sublabelFormatted}</div>
        </div>
      `;
    }).join('');
  }

  // Programs Section
  if (data.programs) {
    setHtml('programs-title', `${data.programs.title_line1}<span class="accent-text">${data.programs.title_line2}</span>`);
    setTxt('programs-subtitle', data.programs.subtitle);

    const programsGrid = document.getElementById('programs-grid');
    if (programsGrid) {
      if (data.programs.videos) {
        programsGrid.innerHTML = data.programs.videos.map(video => `
          <div class="program-card video-card">
            <div class="video-preview-wrapper" onclick="playYoutubeVideo(this, '${video.youtube_id}')">
              <img src="https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg" alt="${video.title}" class="video-thumbnail" onerror="this.src='https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg'">
              <div class="video-play-overlay">
                <div class="video-play-btn" aria-label="เล่นวีดีโอ">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="video-card-content">
              <h3 class="program-title">${video.title}</h3>
              <p class="program-desc">${video.desc}</p>
            </div>
          </div>
        `).join('');
      } else if (data.programs.cards) {
        programsGrid.innerHTML = data.programs.cards.map((card, idx) => `
          <div class="program-card">
            <div class="program-icon" aria-hidden="true">${card.icon}</div>
            <h3 class="program-title">${card.title}</h3>
            <p class="program-desc">${card.desc}</p>
            <div class="program-tags">
              ${card.tags.map(tag => `<span class="program-tag">${tag}</span>`).join('')}
            </div>
          </div>
        `).join('');
      }
    }
  }

  // Services Section
  if (data.services) {
    const servicesBadge = document.getElementById('services-badge');
    if (servicesBadge) servicesBadge.innerHTML = `<span class="badge-dot" aria-hidden="true"></span>${data.services.badge}`;
    setHtml('services-title', `${data.services.title_line1}<span class="accent-text">${data.services.title_line2}</span>`);
    setTxt('services-subtitle', data.services.subtitle);

    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && data.services.cards) {
      servicesGrid.innerHTML = data.services.cards.map(card => {
        const isInternal = !card.url || !card.url.startsWith('http');
        const targetAttr = isInternal ? '' : 'target="_blank" rel="noopener noreferrer"';
        return `
          <a href="${card.url || '#'}" ${targetAttr} class="service-card">
            <div class="service-banner-wrapper">
              <img src="${card.image || ''}" alt="${card.title}" class="service-banner" loading="lazy">
            </div>
            <h3 class="service-title">${card.title}</h3>
          </a>
        `;
      }).join('');
    }
  }

  // Student Union Section
  if (data.student_union) {
    const samoBadge = document.getElementById('samo-badge');
    if (samoBadge) samoBadge.innerHTML = `<span class="badge-dot" aria-hidden="true"></span>${data.student_union.badge}`;

    setHtml('samo-title', `${data.student_union.title_line1}<span class="accent-text">${data.student_union.title_line2}</span>`);
    setTxt('samo-subtitle', data.student_union.subtitle);

    const profile = data.student_union.profile;
    if (profile) {
      setImg('samo-avatar-img', profile.avatar, profile.username);
      setTxt('samo-profile-username', profile.username);

      const followBtn = document.getElementById('samo-follow-btn');
      if (followBtn) {
        followBtn.href = profile.ig_url;
        followBtn.textContent = `📍 ติดตาม @${profile.username}`;
      }

      setTxt('samo-posts-count', profile.posts_count || data.student_union.posts.length);
      setTxt('samo-followers-count', profile.followers_count);
      setTxt('samo-following-count', profile.following_count);
      setTxt('samo-profile-bio', profile.bio);

      // Update lightbox author info
      const modalAuthorName = document.getElementById('samo-modal-author-name');
      if (modalAuthorName) modalAuthorName.textContent = profile.username;
      setImg('samo-modal-avatar-el', profile.avatar, profile.username);

      const modalIgLink = document.getElementById('samo-modal-ig-link');
      if (modalIgLink) modalIgLink.href = profile.ig_url;
    }

    const samoFeedGrid = document.getElementById('samo-feed-grid');
    if (samoFeedGrid && data.student_union.posts) {
      samoFeedGrid.innerHTML = data.student_union.posts.map((post, idx) => {
        const embedHtml = formatInstagramEmbed(post.embed_code);
        if (embedHtml) {
          return `
            <div class="samo-post-item has-embed reveal">
              <div class="samo-post-embed-container">
                ${embedHtml}
              </div>
            </div>
          `;
        }

        const escapedCaption = (post.caption || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        const escapedEmbed = (post.embed_code || '').replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        return `
          <div class="samo-post-item reveal" onclick="openSamoPost('${post.image}', '${escapedCaption}', '${post.date}', ${post.likes}, ${post.comments}, '${escapedEmbed}')">
            <div class="samo-post-overlay">
              <span class="samo-overlay-stat">❤️ ${post.likes}</span>
              <span class="samo-overlay-stat">💬 ${post.comments}</span>
            </div>
            <img src="${post.image}" alt="Post" class="samo-post-img" loading="lazy">
          </div>
        `;
      }).join('');

      // Trigger Instagram embeds process if blockquote is used
      if (data.student_union.posts.some(p => p.embed_code && p.embed_code.includes('<blockquote'))) {
        const triggerProc = () => {
          if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
          }
        };
        if (window.instgrm) {
          triggerProc();
        } else if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = "//www.instagram.com/embed.js";
          script.onload = triggerProc;
          document.body.appendChild(script);
        }
      }
    }
  }

  // News Section
  if (data.news) {
    const newsBadge = document.getElementById('news-badge');
    if (newsBadge) newsBadge.innerHTML = `<span class="badge-dot" aria-hidden="true"></span>${data.news.badge}`;
    setHtml('news-title', `${data.news.title_line1}<span class="accent-text">${data.news.title_line2}</span>`);
    setTxt('news-subtitle', data.news.subtitle);

    const newsGrid = document.getElementById('news-grid');
    if (newsGrid && data.news.list) {
      newsGrid.innerHTML = data.news.list.map((item, idx) => {
        let icon = '📢';
        if (idx === 0) icon = '🎓';
        if (idx === 1) icon = '🏆';
        if (idx === 2) icon = '🤝';

        const isFacebook = item.link && (item.link.includes('facebook.com') || item.link.includes('fb.watch') || item.link.includes('fb.com'));
        const linkText = isFacebook ? 'อ่านต่อบน Facebook' : 'อ่านเพิ่มเติม';
        const linkAttr = item.link ? `href="${item.link}" target="_blank" rel="noopener noreferrer"` : `href="#"`;
        const imageContent = item.image
          ? `<img src="${item.image}" alt="${item.title}">`
          : icon;

        return `
          <article class="news-card">
            <a ${linkAttr} class="news-image" aria-hidden="true">
              ${imageContent}
            </a>
            <div class="news-body">
              <div class="news-date">${item.date}</div>
              <h3 class="news-title">
                <a ${linkAttr} style="color: inherit; text-decoration: none; transition: color var(--transition-fast);">${item.title}</a>
              </h3>
              <p class="news-excerpt">${item.excerpt}</p>
              <a ${linkAttr} class="news-link">${linkText} <span aria-hidden="true">→</span></a>
            </div>
          </article>
        `;
      }).join('');
    }
  }

  // Contact Section
  if (data.contact) {
    const contactBadge = document.getElementById('contact-badge');
    if (contactBadge) contactBadge.innerHTML = `<span class="badge-dot" aria-hidden="true"></span>${data.contact.badge}`;
    setHtml('contact-title', `${data.contact.title_line1}<span class="accent-text">${data.contact.title_line2}</span>`);
    setTxt('contact-subtitle', data.contact.subtitle);

    setTxt('contact-address', data.contact.address);
    setTxt('contact-phone', data.contact.phone);

    // Set Facebook link and name
    const facebookLink = document.getElementById('contact-facebook');
    if (facebookLink) {
      facebookLink.href = data.contact.facebook_url || '#';
      facebookLink.textContent = data.contact.facebook_name || 'Facebook';
    }

    setTxt('contact-hours', data.contact.hours);
  }

  // Footer Branding & Text
  if (data.footer) {
    setTxt('footer-desc', data.footer.desc);
    setTxt('footer-copy', data.footer.copy);
    setTxt('footer-credits', data.footer.credits);

    const renderFooterLinks = (id, items) => {
      const container = document.getElementById(id);
      if (!container) return;
      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = items.map(link => {
        const href = link.url || '#';
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
        const label = link.label || link.name || href;
        return `<a href="${href}" class="footer-link" ${target}>${label}</a>`;
      }).join('');
    };

    const socialContainer = document.getElementById('footer-social-container');
    if (socialContainer) {
      if (Array.isArray(data.footer.socials) && data.footer.socials.length > 0) {
        socialContainer.innerHTML = data.footer.socials.map(item => {
          const href = item.url || '#';
          const isExternal = href.startsWith('http://') || href.startsWith('https://');
          const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
          const icon = item.icon || '🔗';
          const name = item.name || 'Social';
          return `<a href="${href}" class="social-link" title="${name}" aria-label="${name}" ${target}>${icon}</a>`;
        }).join('');
      } else {
        socialContainer.innerHTML = '';
      }
    }

    renderFooterLinks('footer-quick-links', data.footer.quick_links);
    renderFooterLinks('footer-partner-links', data.footer.partner_links);
    renderFooterLinks('footer-resource-links', data.footer.resource_links);
  }
}

/* ============================================
   ABOUT DETAIL POPUP MODAL
   ============================================ */
function initAboutModal() {
  const modal = document.getElementById('about-detail-modal');
  if (!modal) return;

  const overlay = document.getElementById('about-modal-overlay');
  const closeBtn = document.getElementById('about-modal-close');
  const modalIcon = document.getElementById('about-modal-icon');
  const modalTitle = document.getElementById('about-modal-title');
  const modalBody = document.getElementById('about-modal-body');

  const openModal = (icon, title, bodyText, imageUrl) => {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;

    // Clear previous content safely
    modalBody.innerHTML = '';

    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = title;
      img.className = 'about-modal-img';
      modalBody.appendChild(img);
    }

    const p = document.createElement('p');
    p.style.whiteSpace = 'pre-line';
    p.textContent = bodyText || "ไม่มีข้อมูลรายละเอียด";
    modalBody.appendChild(p);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach click listener to history trigger button
  const historyTrigger = document.getElementById('about-history-trigger');
  if (historyTrigger) {
    historyTrigger.addEventListener('click', () => {
      openModal(
        historyTrigger.dataset.icon || "🎓",
        historyTrigger.dataset.title || "ประวัติความเป็นมา",
        historyTrigger.dataset.body || "",
        historyTrigger.dataset.image || ""
      );
    });
  }

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* Helper: Update Instagram Embed themes dynamically */
function updateInstagramEmbedThemes() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  document.querySelectorAll('.instagram-embed-iframe').forEach(iframe => {
    let src = iframe.getAttribute('src');
    if (!src) return;
    if (isDark) {
      if (!src.includes('theme=dark')) {
        iframe.src = src.includes('?') ? src + '&theme=dark' : src + '?theme=dark';
      }
    } else {
      if (src.includes('theme=dark')) {
        iframe.src = src.replace(/[?&]theme=dark/, '').replace(/\/\?$/, '/');
      }
    }
  });
}

/* Helper: Format Instagram URLs or Blockquotes into clean, direct iFrames */
function formatInstagramEmbed(rawInput) {
  if (!rawInput || !rawInput.trim()) return '';
  const input = rawInput.trim();

  if (input.includes('<iframe')) {
    return input;
  }

  const urlMatch = input.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);

  if (urlMatch && urlMatch[1]) {
    const shortcode = urlMatch[1];
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const themeParam = isDark ? '?theme=dark' : '';
    return `<iframe src="https://www.instagram.com/p/${shortcode}/embed/captioned/${themeParam}" class="instagram-embed-iframe" frameborder="0" scrolling="no" allowtransparency="true" allow="encrypted-media"></iframe>`;
  }

  return input;
}

/* ============================================
   SAMO INSTAGRAM POST DETAIL MODAL
   ============================================ */
function initSamoModal() {
  const modal = document.getElementById('samo-post-modal');
  if (!modal) return;

  const overlay = document.getElementById('samo-modal-overlay');
  const closeBtn = document.getElementById('samo-modal-close');
  const modalImg = document.getElementById('samo-modal-img-el');
  const modalCaption = document.getElementById('samo-modal-caption-text-el');
  const modalDate = document.getElementById('samo-modal-date-el');
  const modalLikes = document.getElementById('samo-modal-likes-el');
  const modalComments = document.getElementById('samo-modal-comments-el');

  window.openSamoPost = (imageSrc, caption, dateText, likesCount, commentsCount, embedCode = '') => {
    const modalLeft = document.getElementById('samo-modal-left');
    const modalRight = document.getElementById('samo-modal-right');
    const embedWrapper = document.getElementById('samo-modal-embed-wrapper');

    const cleanEmbed = embedCode ? embedCode.replace(/&#39;/g, "'").replace(/&quot;/g, '"') : '';
    const embedHtml = formatInstagramEmbed(cleanEmbed);

    if (embedHtml) {
      if (modalLeft) modalLeft.style.display = 'none';
      if (modalRight) modalRight.style.display = 'none';
      if (embedWrapper) {
        embedWrapper.innerHTML = embedHtml;
        embedWrapper.style.display = 'block';

        if (cleanEmbed.includes('<blockquote')) {
          const triggerProc = () => {
            if (window.instgrm && window.instgrm.Embeds) {
              window.instgrm.Embeds.process();
            }
          };
          if (window.instgrm) {
            triggerProc();
          } else if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = "//www.instagram.com/embed.js";
            script.onload = triggerProc;
            document.body.appendChild(script);
          }
        }
      }
    } else {
      if (modalLeft) modalLeft.style.display = '';
      if (modalRight) modalRight.style.display = '';
      if (embedWrapper) {
        embedWrapper.style.display = 'none';
        embedWrapper.innerHTML = '';
      }

      if (modalImg) modalImg.src = imageSrc;

      const cleanCaption = caption
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');

      if (modalCaption) modalCaption.textContent = cleanCaption;
      if (modalDate) modalDate.textContent = dateText;
      if (modalLikes) modalLikes.textContent = likesCount;
      if (modalComments) modalComments.textContent = commentsCount;
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Reset embed wrapper
    const modalLeft = document.getElementById('samo-modal-left');
    const modalRight = document.getElementById('samo-modal-right');
    const embedWrapper = document.getElementById('samo-modal-embed-wrapper');
    if (modalLeft) modalLeft.style.display = '';
    if (modalRight) modalRight.style.display = '';
    if (embedWrapper) {
      embedWrapper.style.display = 'none';
      embedWrapper.innerHTML = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============================================
   YOUTUBE INLINE VIDEO PLAYER SWAPPER
   ============================================ */
window.playYoutubeVideo = function (wrapper, youtubeId) {
  wrapper.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
    </iframe>
  `;
};

/* ============================================
   FLOATING ACTION CONTROLS (Scroll-to-top & Chat)
   ============================================ */
function initFloatingControls() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    smoothScrollToTop();
  });
}

function smoothScrollToTop() {
  const startPos = window.pageYOffset;
  if (startPos === 0) return;

  const duration = 800; // Controlled comfortable speed (ms)
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Smooth Ease-Out Cubic formula for natural, pleasant deceleration
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, startPos * (1 - easeOutCubic));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, 0);
    }
  }

  requestAnimationFrame(animation);
}


