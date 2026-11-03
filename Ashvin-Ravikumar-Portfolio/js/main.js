(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();

  const progress = document.querySelector('.scroll-progress');
  let scrollQueued = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateScroll);
      scrollQueued = true;
    }
  }, { passive: true });
  updateScroll();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
    revealObserver.observe(el);
  });

  const glow = document.querySelector('.cursor-glow');
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    let x = innerWidth * .75, y = innerHeight * .3, tx = x, ty = y;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const moveGlow = () => {
      x += (tx - x) * .075;
      y += (ty - y) * .075;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      requestAnimationFrame(moveGlow);
    };
    moveGlow();
  }

  const projectInfo = {
    print: {
      index: 'PROJECT 01 / ANDROID APPLICATION', title: 'PrintXpress', subtitle: 'Digital printing service application',
      paragraphs: ['An Android application for browsing digital printing products such as business cards, posters, banners, flyers, stickers, mugs, and T-shirts; managing a shopping cart; and placing print orders.', 'The resume describes Firebase Authentication for registration, login, and profile management, with Firestore and Cloud Storage for product data, order management, and file handling. The application uses MVVM to separate UI, business logic, and data layers.', 'Product browsing, categories, and detail screens were built with activities, fragments, and adapters. A category/slug mismatch that caused empty product lists was debugged, and the UI follows Material Design principles.'], tags: ['Java', 'Android Studio', 'MVVM', 'Firebase Authentication', 'Firestore', 'Cloud Storage', 'Material Design']
    },
    globe: {
      index: 'PROJECT 02 / FULL-STACK WEB APPLICATION', title: 'GlobeTrek Adventures', subtitle: 'Travel & tourism web application',
      paragraphs: ['A full-stack travel and tourism platform built from scratch for customer, staff, and administrator roles.', 'The backend uses PHP and MySQL with PDO prepared statements. The resume notes bcrypt password hashing and CSRF token protection for authentication and form handling.', 'A responsive HTML, CSS, and Bootstrap 5 frontend includes AJAX-based search. End-to-end frontend/backend integration and application debugging were part of the project.'], tags: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'PHP', 'MySQL', 'PDO', 'XAMPP']
    },
    safe: {
      index: 'PROJECT 03 / ACADEMIC SYSTEM DESIGN', title: 'SafeNation — Disaster Link', subtitle: 'AI-assisted disaster management system concept',
      paragraphs: ['An academic project and system design for a disaster management and emergency response platform concept addressing floods, landslides, fires, and storms.', 'The design covers reporting, emergency alerts, resource coordination, role-based access for citizens and response organizations, and proposed Leaflet/OpenStreetMap mapping for shelter and hospital locations. English, Sinhala, and Tamil support was planned.', 'AI-assisted severity classification and decision support appear as concepts in the resume. This portfolio does not claim a trained AI model, predictions, live reports, or an operational emergency service.'], tags: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript', 'PHP', 'MySQL', 'Python', 'Leaflet', 'OpenStreetMap']
    },
    water: {
      index: 'PROJECT 04 / ACADEMIC PROJECT', title: 'NWSDB', subtitle: 'Service-oriented water billing & payment system',
      paragraphs: ['A service-oriented water billing and payment system with independent NWSDB and Bank APIs.', 'Features described in the resume include customer management, bill tracking, water usage monitoring, and payment history. A simulated payment gateway supports the transaction workflow; it is not a real financial processor.', 'Customer and third-party web applications use ASP.NET Core MVC. The project applies service-oriented architecture, database separation, and API testing.'], tags: ['ASP.NET Core Web API', 'C#', '.NET', 'SQL Server', 'Entity Framework Core', 'REST APIs', 'ASP.NET Core MVC']
    }
  };
  const dialog = document.querySelector('.project-dialog');
  const closeDialog = () => dialog.close();
  document.querySelectorAll('.details-trigger').forEach(button => button.addEventListener('click', () => {
    const data = projectInfo[button.dataset.project];
    dialog.querySelector('.dialog-index').textContent = data.index;
    dialog.querySelector('#dialog-title').textContent = data.title;
    dialog.querySelector('.dialog-subtitle').textContent = data.subtitle;
    const body = dialog.querySelector('.dialog-body');
    body.replaceChildren(...data.paragraphs.map(copy => {
      const p = document.createElement('p');
      p.textContent = copy;
      return p;
    }));
    const tags = dialog.querySelector('.dialog-tags');
    tags.replaceChildren(...data.tags.map(label => {
      const tag = document.createElement('span');
      tag.textContent = label;
      return tag;
    }));
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });

  const setupCanvas = (canvas, mode) => {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let width = 0, height = 0, dpr = 1, frame = 0, particles = [], visible = false;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height; dpr = Math.min(devicePixelRatio || 1, 1.7);
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(26, Math.min(78, Math.floor(width * height / (mode === 'hero' ? 18000 : 24000))));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * (mode === 'hero' ? .18 : .14),
        vy: (Math.random() - .5) * .14,
        radius: Math.random() * 1.35 + .35,
        alpha: Math.random() * .34 + .12,
        phase: Math.random() * Math.PI * 2
      }));
    };
    const draw = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      const maxDistance = mode === 'hero' ? 126 : 142;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.phase += .008;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;
        const alpha = p.alpha * (.72 + Math.sin(p.phase) * .28);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = mode === 'hero' ? `rgba(167,151,255,${alpha})` : `rgba(106,193,224,${alpha})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j], dx = a.x - b.x, dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * (mode === 'hero' ? .12 : .1);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = mode === 'hero' ? `rgba(139,135,234,${opacity})` : `rgba(101,184,195,${opacity})`;
            ctx.lineWidth = .6; ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !reduceMotion) draw();
      else cancelAnimationFrame(frame);
    }, { threshold: 0 });
    new ResizeObserver(resize).observe(canvas);
    observer.observe(canvas);
    resize();
  };
  if (!reduceMotion) {
    setupCanvas(document.querySelector('.hero-canvas'), 'hero');
    setupCanvas(document.querySelector('.contact-canvas'), 'contact');
  }
})();
