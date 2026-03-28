(function () {
  'use strict';
  const AVAILABLE = false; // toggle
  const statusDot = document.querySelector('.status-dot');
  const statusEl = document.querySelector('.nav-status');
  if (statusDot && statusEl) {
    statusDot.style.background = AVAILABLE ? 'var(--green)' : 'var(--rose)';
    statusEl.childNodes[statusEl.childNodes.length - 1].textContent = AVAILABLE ? ' Available' : ' Currently Unavailable';
  }
  const isDesktop = window.matchMedia('(min-width: 769px) and (pointer: fine)').matches;
  const roles = ['Developer', 'QA Engineer', 'R&D Lab', 'Data Scientist', 'Coffee Rater', 'Co-Founder'];
  const roleText = document.getElementById('roleText');
  let roleIndex = 0;
  async function morphRole() {
    const current = roleText.textContent;
    for (let i = current.length; i >= 0; i--) { roleText.textContent = current.slice(0, i); await sleep(40); }
    await sleep(200);
    roleIndex = (roleIndex + 1) % roles.length;
    const next = roles[roleIndex];
    for (let i = 0; i <= next.length; i++) { roleText.textContent = next.slice(0, i); await sleep(60); }
    await sleep(2500);
    morphRole();
  }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  setTimeout(morphRole, 2500);
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let mx = 0, my = 0, tx = 0, ty = 0;
  if (isDesktop && cursor && cursorTrail) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx - 4 + 'px';
      cursor.style.top = my - 4 + 'px';
    });
    (function trail() {
      tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
      cursorTrail.style.left = tx - 18 + 'px';
      cursorTrail.style.top = ty - 18 + 'px';
      requestAnimationFrame(trail);
    })();
    document.querySelectorAll('a, button, .mission-card, .project-visual, .contact-link, .key, .lock').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); cursorTrail.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); cursorTrail.classList.remove('hovering'); });
    });
  }
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { navToggle.classList.remove('active'); mobileMenu.classList.remove('open'); document.body.style.overflow = ''; });
  });
  const cinematicObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
        cinematicObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.cinematic').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), 100 + delay * 1000);
    } else {
      cinematicObserver.observe(el);
    }
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });
  function updateParallax() {
    document.querySelectorAll('[data-speed]').forEach(el => {
      const speed = parseFloat(el.dataset.speed);
      const rect = el.getBoundingClientRect();
      const center = (rect.top + rect.height / 2 - window.innerHeight / 2);
      el.style.transform = `translateY(${center * speed}px)`;
    });
  }
  const missionsScene = document.querySelector('.missions-scene');
  const missionsSlides = document.querySelectorAll('.mission-slide');
  const missionsStep = document.getElementById('missionsStep');
  const missionsBar = document.getElementById('missionsBar');
  const totalSlides = missionsSlides.length;
  let currentMission = 0;
  function updateMissions() {
    if (!missionsScene || !isDesktop) return;
    const rect = missionsScene.getBoundingClientRect();
    const scrolled = -rect.top;
    const total = missionsScene.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrolled / total));
    const slideIndex = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));
    if (slideIndex !== currentMission) {
      currentMission = slideIndex;
      missionsSlides.forEach((s, i) => s.classList.toggle('active', i === slideIndex));
      if (missionsStep) missionsStep.textContent = `0${slideIndex + 1} / 0${totalSlides}`;
    }
    if (missionsBar) missionsBar.style.width = (progress * 100) + '%';
  }
  if (isDesktop) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = '';
        setTimeout(() => card.style.transition = '', 500);
      });
    });
  }
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        if (isDesktop) {
          updateParallax();
          updateMissions();
        }
        if (portalOpen) updatePortalWorld();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
  nav.classList.toggle('scrolled', window.scrollY > 60);
  if (isDesktop) { updateParallax(); updateMissions(); }
  if (isDesktop) {
    const heroOrbs = document.querySelectorAll('.hero-orb');
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      heroOrbs.forEach((orb, i) => {
        orb.style.transform = `translate(${x * (i + 1) * 15}px, ${y * (i + 1) * 15}px)`;
      });
    });
  }
  const key = document.getElementById('key');
  const lock = document.getElementById('lock');
  const portal = document.getElementById('portal');
  const portalBar = document.getElementById('portalBar');
  const portalClose = document.getElementById('portalClose');
  const portalWorld = document.getElementById('portalWorld');
  let holdingKey = false;
  let portalOpen = false;
  function pickupKey(e) {
    if (holdingKey || portalOpen) return;
    holdingKey = true;
    key.classList.add('key--held');
    document.body.classList.add('holding-key');
    const cx = (e.clientX || (e.touches && e.touches[0].clientX)) || 0;
    const cy = (e.clientY || (e.touches && e.touches[0].clientY)) || 0;
    key.style.left = (cx - 20) + 'px';
    key.style.top = (cy - 20) + 'px';
  }
  key.addEventListener('click', pickupKey);
  key.addEventListener('touchstart', (e) => { e.preventDefault(); pickupKey(e); }, { passive: false });
  function moveKey(e) {
    if (!holdingKey) return;
    const cx = e.clientX || (e.touches && e.touches[0].clientX);
    const cy = e.clientY || (e.touches && e.touches[0].clientY);
    key.style.left = (cx - 20) + 'px';
    key.style.top = (cy - 20) + 'px';
  }
  document.addEventListener('mousemove', moveKey);
  document.addEventListener('touchmove', moveKey, { passive: false });
  function tryUnlock() {
    if (!holdingKey) return;
    holdingKey = false;
    key.classList.remove('key--held');
    key.classList.add('key--used');
    document.body.classList.remove('holding-key');
    lock.classList.add('lock--unlocked');
    setTimeout(openPortal, 600);
  }
  lock.addEventListener('click', tryUnlock);
  lock.addEventListener('touchend', tryUnlock);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && holdingKey) cancelKey();
    if (e.key === 'Escape' && portalOpen) closePortal();
  });
  function cancelKey() {
    holdingKey = false;
    key.classList.remove('key--held');
    document.body.classList.remove('holding-key');
    key.style.left = ''; key.style.top = '';
  }
  const portalSections = [];
  document.querySelectorAll('#mainContent > *').forEach(section => {
    let visual = section;
    if (section.classList.contains('missions-scene')) {
      visual = section.querySelector('.missions-sticky') || section;
    }
    portalSections.push({ section, visual });
  });
  let cloneCache = new Map();
  function openPortal() {
    portalOpen = true;
    portalWorld.classList.add('alt-theme');
    portal.classList.add('open');
    portal.style.left = Math.max(16, (window.innerWidth / 2 - portal.offsetWidth / 2)) + 'px';
    portal.style.top = Math.max(16, (window.innerHeight / 2 - portal.offsetHeight / 2)) + 'px';
    updatePortalWorld();
  }
  function closePortal() {
    portalOpen = false;
    portal.classList.remove('open');
    portalWorld.innerHTML = '';
    portalWorld.classList.remove('alt-theme');
    cloneCache.clear();
    key.classList.remove('key--used');
    key.style.position = ''; key.style.left = ''; key.style.top = '';
    lock.classList.remove('lock--unlocked');
  }
  portalClose.addEventListener('click', closePortal);
  let dragging = false, dragOff = { x: 0, y: 0 };
  function startDrag(e) {
    if (e.target.closest('.portal-close')) return;
    dragging = true;
    const cx = e.clientX || (e.touches && e.touches[0].clientX);
    const cy = e.clientY || (e.touches && e.touches[0].clientY);
    dragOff.x = cx - portal.offsetLeft;
    dragOff.y = cy - portal.offsetTop;
    e.preventDefault();
  }
  function onDrag(e) {
    if (!dragging) return;
    const cx = e.clientX || (e.touches && e.touches[0].clientX);
    const cy = e.clientY || (e.touches && e.touches[0].clientY);
    portal.style.left = Math.max(0, Math.min(window.innerWidth - portal.offsetWidth, cx - dragOff.x)) + 'px';
    portal.style.top = Math.max(0, Math.min(window.innerHeight - portal.offsetHeight, cy - dragOff.y)) + 'px';
    updatePortalWorld();
  }
  function stopDrag() { dragging = false; }
  portalBar.addEventListener('mousedown', startDrag);
  portalBar.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  function updatePortalWorld() {
    if (!portalOpen) return;
    const barH = 38;
    const pr = portal.getBoundingClientRect();
    const viewTop = pr.top + barH;
    const viewBottom = pr.bottom;
    portalWorld.style.width = window.innerWidth + 'px';
    portalWorld.style.height = window.innerHeight + 'px';
    portalWorld.style.transform = `translate(${-pr.left}px, ${-viewTop}px)`;
    const visible = new Set();
    portalSections.forEach(({ section, visual }) => {
      const rect = visual.getBoundingClientRect();
      const isVisible = rect.bottom > viewTop && rect.top < viewBottom;
      visible.add(visual);
      let entry = cloneCache.get(visual);
      if (isVisible && !entry) {
        const clone = visual.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.overflow = 'hidden';
        clone.style.margin = '0';
        clone.querySelectorAll('.reveal, .cinematic').forEach(el => el.classList.add('visible'));
        clone.querySelectorAll('.key, .lock, script').forEach(el => el.remove());
        applyMTGToClone(clone, section);
        portalWorld.appendChild(clone);
        entry = { clone };
        cloneCache.set(visual, entry);
      } else if (!isVisible && entry) {
        entry.clone.remove();
        cloneCache.delete(visual);
      }
      if (entry) {
        entry.clone.style.top = rect.top + 'px';
        entry.clone.style.left = rect.left + 'px';
        entry.clone.style.width = rect.width + 'px';
        entry.clone.style.height = rect.height + 'px';
      }
    });
    cloneCache.forEach((entry, visual) => {
      if (visual.classList && visual.classList.contains('missions-sticky')) {
        const idx = currentMission >= 0 ? currentMission : 0;
        entry.clone.querySelectorAll('.mission-slide').forEach((s, i) =>
          s.classList.toggle('active', i === idx));
      }
    });
  }
  function applyMTGToClone(clone, section) {
    const swap = (sel, html) => { const el = clone.querySelector(sel); if (el) el.innerHTML = html; };
    if (section.classList.contains('hero')) {
      swap('.role-text', 'Planeswalker');
      const cur = clone.querySelector('.role-cursor'); if (cur) cur.remove();
      swap('.hero-manifesto p', 'You should (not) see the size of my MTG collection.');
      swap('.hero-badge', '</span> Legacy · Modern · Standard · Pauper · "Pioneer"');
    } else if (section.classList.contains('missions-scene')) {
      const slides = clone.querySelectorAll('.mission-slide');
      const data = [
        { num: '01', title: 'The Lantern<br>Enjoyer', desc: 'My all-time favourite deck is Lantern Control. Zugzwang. I love the puzzle presented where I must prevent my opponent from playing the game by locking out all their relevant tools.', tag: 'Philosophy' },
        { num: '02', title: 'Unlimited Coffee<br>Haver', desc: 'The store owners at Luckshack fuel me with a special coffee deal at all their events. It\'s basically a performance-enhancing substance at this point.', tag: 'Edge' },
        { num: '03', title: 'The Information<br>Player', desc: 'I don\'t really have any tricks or even the reps. I study the metagame and play patterns and look for weakness to exploit.', tag: 'Mindset' },
        { num: '04', title: 'African MTG<br>Ambassador', desc: 'Every time a South African player makes it to the Pro Tour, it proves we belong. I want to help build the scene and eventually field a Team South Africa.', tag: 'Mission' },
      ];
      slides.forEach((s, i) => {
        if (!data[i]) return;
        const d = data[i];
        const num = s.querySelector('.mission-number'); if (num) num.textContent = d.num;
        const t = s.querySelector('.mission-title'); if (t) t.innerHTML = d.title;
        const desc = s.querySelector('.mission-desc'); if (desc) desc.textContent = d.desc;
        const tag = s.querySelector('.mission-tag'); if (tag) tag.textContent = d.tag;
      });
      const hdr = clone.querySelector('.missions-header .scene-title'); if (hdr) hdr.textContent = 'Player Trivia';
      const lbl = clone.querySelector('.missions-header .label-mono'); if (lbl) lbl.textContent = 'Things To Know';
    } else if (section.classList.contains('philosophy-scene')) {
      swap('.scene-title', 'Make them play<br>your game.');
      swap('.editorial-accent', 'Then punish the inefficiency.');
      const blocks = clone.querySelectorAll('.philosophy-text');
      if (blocks[0]) blocks[0].innerHTML = 'I think about how my opponent wants to play, then I build game states that take that away from them. Force them onto uncomfortable lines, and the inefficiency creates openings. That\'s what I look for.';
      if (blocks[1]) blocks[1].innerHTML = 'Toolbox decks and combos reward this. Lantern Control, Grinding Station, Lands, Hammer Time. But tempo decks like Humans and Prowess work the same way. Play the right threat at the right time and their whole plan falls apart.';
      if (blocks[2]) blocks[2].innerHTML = 'I\'m always learning. Pattern recognition gets sharper with reps, and studying the metagame gives me a read on what people want to do before they do it. The edge comes from preparation, not assumption.';
      const vals = clone.querySelectorAll('.value');
      [['Toolbox & Combo', 'Lands, Lantern. Decks that lock or disrupt.'], ['Tempo & Aggro', 'Humans, Prowess. Right threats, wrong answers for them.'], ['Preparation', 'Study the meta, read the patterns, find the openings.']].forEach((v, i) => {
        if (!vals[i]) return;
        const s = vals[i].querySelector('strong'); if (s) s.textContent = v[0];
        const p = vals[i].querySelector('p'); if (p) p.textContent = v[1];
      });
      const lbl = clone.querySelector('.label-mono'); if (lbl) lbl.textContent = 'Deck Philosophy';
    } else if (section.classList.contains('work-scene')) {
      const projs = clone.querySelectorAll('.project');
      const data = [
        { title: 'Pro Tour', desc: 'Only player to qualify through the African RCQ chain. Representing South Africa on the biggest stage, proving African players belong at this level despite every disadvantage we face.', stat: 'Qualified', label: 'Pro Tour' },
        { title: 'EMEA Regional Championship', desc: 'Top 20 finish with a rogue Humans build splashing blue for Mockingbird. Won on camera. Studied opponent habits to exploit unfavourable matchups.', stat: 'Top 20', label: 'Regional Championship' },
        { title: 'SA Legacy Nationals', desc: 'National champion. The format where knowing every interaction in the game actually pays off.', stat: 'Winner', label: 'Legacy Nationals' },
      ];
      projs.forEach((p, i) => {
        if (!data[i]) return;
        const d = data[i];
        const t = p.querySelector('.project-title'); if (t) t.textContent = d.title;
        const desc = p.querySelector('.project-desc'); if (desc) desc.textContent = d.desc;
        const stat = p.querySelector('.result-number'); if (stat) stat.textContent = d.stat;
        const lbl = p.querySelector('.result-label'); if (lbl) lbl.textContent = d.label;
        const tagEls = p.querySelectorAll('.role-tag');
        const mtgTags = [['Vegas', 'Standard', 'Draft'], ['Lille', 'Constructed', 'Pioneer'], ['South Africa', 'Constructed', 'Legacy']][i] || ['MTG', 'MTG', 'MTG'];
        tagEls.forEach((tag, j) => {
          tag.textContent = mtgTags[j] || 'MTG';
          tag.style.color = '#8a80a0';
          tag.style.borderColor = 'rgba(140,120,200,.3)';
        });
        const img = p.querySelector('.project-visual img');
        const mtgImgs = ['images/mtg1.png', 'images/mtg2.png', 'images/mtg3.png'];
        if (img && mtgImgs[i]) { img.src = mtgImgs[i]; img.alt = d.title; }
      });
      const lbl = clone.querySelector('.section-label'); if (lbl) lbl.textContent = 'Tournament Record';
    } else if (section.classList.contains('contact-scene')) {
      swap('.scene-title', 'Challenge me<br>to a game.');
      const sub = clone.querySelector('.contact-subtitle');
      if (sub) sub.textContent = 'Arena, paper, webcam. If you made it here, we should shuffle up.';
    } else if (section.classList.contains('marquee')) {
      const decks1 = ['LANTERN CONTROL', 'HAMMER TIME', 'IZZET PROWESS', 'LANDS', 'UWX CONTROL', 'LOTUS COMBO', 'GRINDING STATION', 'DOOMSDAY', 'DEATH\'S SHADOW', 'SAMWISE COMBO', "CAWGATES", "HUMANS", "AFFINITY", "JUND WILDFIRES"];
      const spans = clone.querySelectorAll('.marquee-content span:not(.marquee-dot)');
      spans.forEach((s, i) => { s.textContent = decks1[i % decks1.length]; });
    } else if (section.tagName === 'FOOTER' || section.classList.contains('footer')) {
      const tl = clone.querySelector('.footer-tagline');
      if (tl) tl.textContent = 'Built by one Planeswalker. In response to your end step.';
    }
  }
})();
