(() => {
  const view = document.querySelector('[data-astro-view]');
  const scene = document.querySelector('[data-astro-scene]');
  const canvas = document.querySelector('.astro-orbits');
  const context = canvas?.getContext('2d');
  if (!view || !scene || !context) return;

  const buttons = [...document.querySelectorAll('[data-site-mode]')];
  const planetsRoot = document.querySelector('[data-astro-planets]');
  const dock = document.querySelector('[data-astro-dock]');
  const panel = document.querySelector('[data-astro-panel]');
  const panelContent = document.querySelector('[data-astro-content]');
  const main = document.querySelector('main');
  const footer = document.querySelector('body > .footer');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storageKey = 'jv-portfolio-site-mode';
  const text = (selector) => document.querySelector(selector)?.textContent?.trim() || '';
  const texts = (selector) => [...document.querySelectorAll(selector)].map((node) => node.textContent.trim());
  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  };
  const paragraph = (content) => make('p', '', content);
  const card = (kicker, title, description) => {
    const node = make('article', 'astro-card');
    if (kicker) node.append(make('small', '', kicker));
    node.append(make('h3', '', title));
    if (description) node.append(paragraph(description));
    return node;
  };
  const tags = (values) => {
    const row = make('div', 'astro-tags');
    values.forEach((value) => row.append(make('span', '', value)));
    return row;
  };
  const contactForm = (language) => {
    const english = language === 'en';
    const form = make('form', 'astro-contact-form');
    const fields = [
      { name: 'name', label: english ? 'Name' : 'Nome', tag: 'input', type: 'text' },
      { name: 'email', label: 'E-mail', tag: 'input', type: 'email' },
      { name: 'message', label: english ? 'Message' : 'Mensagem', tag: 'textarea' },
    ];
    fields.forEach((field) => {
      const label = make('label', '', field.label);
      const control = make(field.tag);
      control.name = field.name;
      if (field.type) control.type = field.type;
      control.required = true;
      if (field.name === 'message') control.rows = 4;
      label.append(control);
      form.append(label);
    });
    const submit = make('button', 'astro-project-link', english ? 'Open email app ↗' : 'Abrir aplicativo de e-mail ↗');
    submit.type = 'submit';
    form.append(submit);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const subject = english ? `Portfolio contact from ${values.get('name')}` : `Contato pelo portfólio de ${values.get('name')}`;
      const message = `${values.get('message')}\n\n${english ? 'Reply to' : 'Responder para'}: ${values.get('email')}`;
      window.location.href = `mailto:valentedev00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    });
    return form;
  };
  const legalLinks = (language) => {
    const list = make('div', 'astro-legal-links');
    const privacy = make('a', '', language === 'en' ? 'Privacy' : 'Privacidade');
    const terms = make('a', '', language === 'en' ? 'Terms' : 'Termos');
    privacy.href = 'privacidade.html';
    terms.href = 'termos.html';
    const textureCredit = make('a', '', language === 'en' ? 'Planet textures · Solar System Scope (CC BY 4.0)' : 'Texturas dos planetas · Solar System Scope (CC BY 4.0)');
    textureCredit.href = 'https://www.solarsystemscope.com/textures/';
    textureCredit.target = '_blank';
    textureCredit.rel = 'noopener noreferrer';
    list.append(privacy, terms, textureCredit);
    return list;
  };

  const sections = [
    { id: 'sobre', name: 'Sobre', body: 'Sol · origem da jornada', planet: 'sun', size: 79, phase: 0, render() {
      panelContent.append(paragraph(text('.profile-description')));
      texts('.about-copy > p').forEach((value) => panelContent.append(paragraph(value)));
    } },
    { id: 'experiencia', name: 'Experiência', body: 'Mercúrio · trajetória', planet: 'mercury', size: 17, phase: 3.7, render() {
      const node = card(text('.experience-date'), text('.experience-item h3'), text('.experience-item p:not(.experience-company)'));
      node.insertBefore(paragraph(text('.experience-company')), node.querySelector('p'));
      node.append(tags(texts('.experience-item .tech-tags span')));
      panelContent.append(node);
    } },
    { id: 'servicos', name: 'Serviços', body: 'Vênus · soluções digitais', planet: 'venus', size: 23, phase: 5.0, render() {
      panelContent.append(paragraph('Construo soluções digitais do primeiro componente até a entrega. Estas são as frentes que aparecem na minha experiência e competências.'));
      panelContent.append(card('01 · Interface', 'Web responsiva', 'Interfaces com React, Next.js, Bootstrap, Sass e atenção à experiência do usuário.'));
      panelContent.append(card('02 · Integração', 'Back-end e APIs', 'Serviços e integrações com Node.js, Python e bancos de dados SQL e NoSQL.'));
      panelContent.append(card('03 · Infraestrutura', 'Nuvem e automação', 'Soluções em AWS e automação de processos para ampliar funcionalidades.'));
    } },
    { id: 'projetos', name: 'Projetos', body: 'Terra · ideias em construção', planet: 'earth', size: 29, phase: .75, render() {
      panelContent.append(paragraph('Projetos pessoais, estudos e entregas reunidos no feed do portfólio.'));
      (window.blogFeedPosts || []).forEach((post, index) => {
        const node = card(`${String(index + 1).padStart(2, '0')} · ${post.category}`, post.title, post.description);
        if (post.image) {
          const image = make('img');
          image.src = post.image;
          image.alt = post.imageAlt || post.title;
          image.loading = 'lazy';
          node.insertBefore(image, node.querySelector('p'));
        }
        const link = make('button', 'astro-project-link', 'Ver no feed →');
        link.type = 'button';
        link.addEventListener('click', () => {
          setMode('normal', true);
          location.hash = '#projetos';
        });
        node.append(link);
        panelContent.append(node);
      });
    } },
    { id: 'notas', name: 'Notas', body: 'Marte · sinais em andamento', planet: 'mars', size: 21, phase: 2.5, render() {
      panelContent.append(card('Diário de construção', text('.newsletter h2'), text('.newsletter .contact-window-body > div > p:not(.eyebrow)')));
      panelContent.append(paragraph('As atualizações e os projetos mais recentes ficam no feed do modo Normal.'));
    } },
    { id: 'habilidades', name: 'Habilidades', body: 'Júpiter · repertório', planet: 'jupiter', size: 43, phase: 5.25, render() {
      panelContent.append(paragraph('Tecnologias e competências que uso para construir produtos digitais.'));
      panelContent.append(tags(texts('.skill-list span')));
    } },
    { id: 'educacao', name: 'Educação', body: 'Saturno · formação', planet: 'saturn', size: 40, phase: 1.65, render() {
      const node = card('Formação acadêmica', text('.diploma h2'), text('.diploma p:not(.eyebrow)'));
      panelContent.append(node);
    } },
    { id: 'cursos', name: 'Cursos', body: 'Urano · aprendizado contínuo', planet: 'uranus', size: 31, phase: 3.8, render() {
      panelContent.append(paragraph('Certificados e cursos concluídos, com links para consulta.'));
      const list = make('div', 'astro-link-list');
      document.querySelectorAll('.certificate-list a').forEach((source) => {
        const link = make('a', '', source.textContent.trim());
        link.href = source.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        list.append(link);
      });
      panelContent.append(list);
    } },
    { id: 'contato', name: 'Contato', body: 'Netuno · próxima conexão', planet: 'neptune', size: 30, phase: .08, render() {
      panelContent.append(paragraph('Quer conversar sobre um projeto ou uma oportunidade? Entre em contato.'));
      const list = make('div', 'astro-link-list');
      const email = document.querySelector('.contact-links a[href^="mailto:"]');
      const linkedin = document.querySelector('.contact-links a[href*="linkedin.com"]');
      if (email) {
        const link = make('a', '', 'E-mail · valentedev00@gmail.com ↗');
        link.href = email.href;
        list.append(link);
      }
      if (linkedin) {
        const link = make('a', '', 'LinkedIn · João Vitor Valente ↗');
        link.href = linkedin.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        list.append(link);
      }
      panelContent.append(list);
      const copy = make('button', 'astro-project-link', 'Copiar e-mail');
      copy.type = 'button';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('valentedev00@gmail.com');
          copy.textContent = 'E-mail copiado ✓';
        } catch {
          copy.textContent = 'Use valentedev00@gmail.com';
        }
      });
      panelContent.append(copy);
      panelContent.append(contactForm('pt'), legalLinks('pt'));
    } },
  ];

  const englishNames = ['About', 'Experience', 'Services', 'Projects', 'Notes', 'Skills', 'Education', 'Courses', 'Contact'];
  const englishBodies = [
    'Sun · the beginning', 'Mercury · the journey', 'Venus · digital solutions',
    'Earth · ideas in progress', 'Mars · ongoing signals', 'Jupiter · toolkit',
    'Saturn · education', 'Uranus · continuous learning', 'Neptune · the next connection',
  ];
  const englishUI = {
    status: 'Open to new opportunities',
    role: 'Fullstack developer · Web · APIs · Cloud',
    lead: 'I hold a degree in Computer Science and work as a fullstack developer. Here I share my journey, projects, and what I learn while building new solutions.',
    explore: 'Explore the system →',
    contact: 'Get in touch ↗',
    projects: 'projects in the feed',
    education: 'graduation',
    hint: 'Drag to rotate · scroll to zoom · click a planet',
    previous: '← Previous',
    next: 'Next →',
  };

  function renderEnglish(index) {
    if (index === 0) {
      [
        englishUI.lead,
        'I am a Computer Science graduate and a fullstack developer. During two years at the Regional Labor Court of the 8th Region (TRT8), I helped build and improve public sector solutions with attention to technical quality and user experience.',
        'I also took part in COP30 in Belém, Brazil. I build responsive interfaces with React, Next.js and Bootstrap, as well as backends and integrations with Node.js and Python.',
        'My experience includes SQL, SQLite and NoSQL databases, WordPress customization, Sass, UX/UI, AWS and APIs. I use these tools to automate processes and build scalable cloud solutions.',
        'I enjoy learning new technologies and working with different teams. I am looking for opportunities where I can contribute a product mindset and careful development from the first component to production.',
      ].forEach((value) => panelContent.append(paragraph(value)));
    }
    if (index === 1) {
      const node = card('Jan 2024 — Dec 2025 · Belém, Brazil', 'Developer Intern', 'I developed and maintained responsive web interfaces and helped improve the usability and accessibility of internal systems. I also contributed to backend development and APIs.');
      node.insertBefore(paragraph('Regional Labor Court of the 8th Region — TRT8'), node.querySelector('p'));
      node.append(tags(texts('.experience-item .tech-tags span')));
      panelContent.append(node);
    }
    if (index === 2) {
      panelContent.append(paragraph('I build digital solutions from the first component through delivery.'));
      panelContent.append(card('01 · Interface', 'Responsive web', 'Interfaces built with React, Next.js, Bootstrap and Sass, with attention to user experience.'));
      panelContent.append(card('02 · Integration', 'Backend and APIs', 'Services and integrations using Node.js, Python, SQL and NoSQL databases.'));
      panelContent.append(card('03 · Infrastructure', 'Cloud and automation', 'AWS solutions and process automation to extend product capabilities.'));
    }
    if (index === 3) {
      panelContent.append(paragraph('Personal projects, studies and work in progress from my portfolio feed.'));
      (window.blogFeedPosts || []).forEach((post, projectIndex) => {
        const title = projectIndex === 0 ? 'My first project: this blog' : post.title;
        const description = projectIndex === 0 ? 'This is my blog and the first project I have written about here.' : post.title === 'Açaí na Cuia' ? 'A website designed to connect a small business with more customers and expand its sales reach.' : post.description;
        const node = card(`${String(projectIndex + 1).padStart(2, '0')} · Personal project`, title, description);
        if (post.image) {
          const image = make('img');
          image.src = post.image;
          image.alt = post.imageAlt || post.title;
          image.loading = 'lazy';
          node.insertBefore(image, node.querySelector('p'));
        }
        const link = make('button', 'astro-project-link', 'View in the feed →');
        link.type = 'button';
        link.addEventListener('click', () => { setMode('normal', true); location.hash = '#projetos'; });
        node.append(link);
        panelContent.append(node);
      });
    }
    if (index === 4) {
      panelContent.append(card('Building notes', 'Building the next step.', 'New projects, lessons and solutions are always in motion. This space will soon bring together what I am creating next.'));
      panelContent.append(paragraph('The latest updates and projects are available in the Normal mode feed.'));
    }
    if (index === 5) {
      panelContent.append(paragraph('Technologies and skills I use to build digital products.'));
      panelContent.append(tags([
        'Frontend · React · Next.js', 'HTML5 · CSS3 · Bootstrap · Sass', 'UX/UI · WordPress',
        'Backend · Node.js · Python', 'SQL · SQLite · NoSQL', 'AWS · APIs · scalable solutions',
        'Process automation (RPA)', 'Communication · teamwork', 'Office tools · intermediate English',
      ]));
    }
    if (index === 6) panelContent.append(card('Education', 'Bachelor of Computer Science', 'University of the Amazon — UNAMA · Graduated in 2026'));
    if (index === 7) {
      panelContent.append(paragraph('Completed courses and certificates, with links for verification.'));
      const list = make('div', 'astro-link-list');
      document.querySelectorAll('.certificate-list a').forEach((source) => {
        const link = make('a', '', source.textContent.trim());
        link.href = source.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        list.append(link);
      });
      panelContent.append(list);
    }
    if (index === 8) {
      panelContent.append(paragraph('Would you like to discuss a project or an opportunity? Get in touch.'));
      const list = make('div', 'astro-link-list');
      const email = make('a', '', 'Email · valentedev00@gmail.com ↗');
      email.href = document.querySelector('.contact-links a[href^="mailto:"]')?.href || 'mailto:valentedev00@gmail.com';
      const linkedin = make('a', '', 'LinkedIn · João Vitor Valente ↗');
      linkedin.href = document.querySelector('.contact-links a[href*="linkedin.com"]')?.href || '#';
      linkedin.target = '_blank';
      linkedin.rel = 'noopener noreferrer';
      list.append(email, linkedin);
      panelContent.append(list);
      const copy = make('button', 'astro-project-link', 'Copy email');
      copy.type = 'button';
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText('valentedev00@gmail.com'); copy.textContent = 'Email copied ✓'; }
        catch { copy.textContent = 'Use valentedev00@gmail.com'; }
      });
      panelContent.append(copy);
      panelContent.append(contactForm('en'), legalLinks('en'));
    }
  }

  const planetButtons = sections.map((section, index) => {
    const button = make('button', `astro-planet astro-body-${section.planet}`);
    button.type = 'button';
    button.style.setProperty('--planet-size', `${section.size}px`);
    button.setAttribute('aria-label', `${section.name}, ${section.body}`);
    button.append(make('span', 'astro-planet-label', section.name), make('span', 'astro-planet-sphere'));
    button.addEventListener('click', () => openSection(index));
    planetsRoot.append(button);
    const dockButton = make('button');
    dockButton.type = 'button';
    dockButton.append(make('small', '', String(index).padStart(2, '0')), document.createTextNode(section.name));
    dockButton.addEventListener('click', () => openSection(index));
    dock.append(dockButton);
    return button;
  });
  const dockButtons = [...dock.querySelectorAll('button')];
  const standby = document.querySelector('[data-astro-standby]');
  const probe = make('button', 'astro-probe');
  probe.type = 'button';
  probe.setAttribute('aria-label', 'Sinal do espaço profundo');
  probe.append(make('span', '', '✧'), make('small', '', 'SINAL'));
  planetsRoot.append(probe);
  document.querySelector('[data-astro-project-count]').textContent = String((window.blogFeedPosts || []).length).padStart(2, '0');

  let current = null;
  let language = 'pt';
  let running = false;
  let frameId = 0;
  let width = 0;
  let height = 0;
  let zoom = 1;
  let rotation = 0;
  let centerX = 0;
  let pointer = null;
  let stars = [];
  let clock = 0;
  const sceneCenterX = () => width * (current === null ? (width < 700 ? .7 : width < 1100 ? .82 : .73) : (width < 700 ? .5 : .37));

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = view.clientWidth;
    height = view.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    let seed = 1731;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    stars = Array.from({ length: Math.min(320, Math.round(width * height / 3500)) }, () => ({
      x: random() * width, y: random() * height, radius: .3 + random() * 1.15, phase: random() * 6.28,
    }));
    centerX = sceneCenterX();
    renderScene();
  }

  function renderScene() {
    if (view.hidden || !width || !height) return;
    const targetX = sceneCenterX();
    centerX += (targetX - centerX) * (reducedMotion ? 1 : .09);
    const centerY = height * (width < 700 ? (current === null ? .66 : .35) : .53);
    const base = Math.min(width * (width < 700 ? .34 : width < 1100 ? .28 : .35), height * (width < 700 ? .38 : .54)) * zoom;
    context.clearRect(0, 0, width, height);
    const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, base * 1.5);
    glow.addColorStop(0, '#1b90b72b');
    glow.addColorStop(.48, '#17415c18');
    glow.addColorStop(1, '#050a1200');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    for (const star of stars) {
      const alpha = reducedMotion ? .63 : .38 + .28 * (1 + Math.sin(clock * .001 + star.phase));
      context.fillStyle = `rgba(157,218,236,${alpha * .72})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }
    for (let index = 1; index < sections.length; index++) {
      const rx = base * (.13 + index * .11);
      const ry = rx * .35;
      context.beginPath();
      context.ellipse(centerX, centerY, rx, ry, -.15 + rotation * .12, 0, Math.PI * 2);
      context.strokeStyle = `rgba(102,184,211,${index === current ? .42 : .17})`;
      context.lineWidth = 1;
      context.setLineDash(index === current ? [] : [2, 7]);
      context.stroke();
      context.setLineDash([]);
      const section = sections[index];
      const angle = section.phase + rotation + (reducedMotion ? 0 : clock * .000012 / Math.sqrt(index));
      const x = centerX + Math.cos(angle) * rx;
      const y = centerY + Math.sin(angle) * ry;
      planetButtons[index].style.left = `${x}px`;
      planetButtons[index].style.top = `${y}px`;
      planetButtons[index].style.opacity = current !== null && current !== index ? '.72' : '1';
    }
    // Fine chart marks give this scene a technical, illustrated-map feel.
    for (let index = 0; index < 90; index++) {
      const angle = index * 2.399 + rotation;
      const radius = base * (.62 + (index % 9) * .012);
      context.fillStyle = `rgba(114,215,255,${.1 + (index % 5) * .035})`;
      context.fillRect(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius * .35, 1, 1);
    }
    planetButtons[0].style.left = `${centerX}px`;
    planetButtons[0].style.top = `${centerY}px`;
  }

  function tick() {
    if (!running) return;
    clock = performance.now();
    renderScene();
    if (!reducedMotion) frameId = requestAnimationFrame(tick);
  }

  function startScene() {
    if (running || document.hidden) return;
    running = true;
    tick();
  }
  function stopScene() {
    running = false;
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function setLanguage(next, persist = false) {
    language = next === 'en' ? 'en' : 'pt';
    const english = language === 'en';
    document.documentElement.lang = english && !view.hidden ? 'en' : 'pt-BR';
    document.querySelectorAll('[data-astro-lang]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.astroLang === language));
    });
    const status = document.querySelector('.astro-status');
    status.replaceChildren(make('span'), document.createTextNode(english ? englishUI.status : 'Disponível para desafios'));
    document.querySelector('.astro-brand-label small').textContent = english ? 'FULLSTACK DEVELOPER' : 'DESENVOLVEDOR FULLSTACK';
    document.querySelector('.astro-role').textContent = english ? englishUI.role : 'Desenvolvedor Fullstack · Web · APIs · Cloud';
    document.querySelector('.astro-lead').textContent = english ? englishUI.lead : text('.profile-description');
    document.querySelector('[data-astro-explore]').textContent = english ? englishUI.explore : 'Explorar o sistema →';
    document.querySelector('.astro-action-secondary').textContent = english ? englishUI.contact : 'Entrar em contato ↗';
    const statLabels = document.querySelectorAll('.astro-stats span');
    statLabels[0].textContent = english ? englishUI.projects : 'projetos no feed';
    statLabels[1].textContent = english ? englishUI.education : 'formação';
    document.querySelector('.astro-hint').textContent = english ? englishUI.hint : 'Arraste para girar · role para aproximar · clique em um planeta';
    document.querySelector('[data-astro-prev]').textContent = english ? englishUI.previous : '← Anterior';
    document.querySelector('[data-astro-next]').textContent = english ? englishUI.next : 'Próximo →';
    document.querySelector('[data-astro-close]').setAttribute('aria-label', english ? 'Close section' : 'Fechar seção');
    probe.setAttribute('aria-label', english ? 'Deep-space signal' : 'Sinal do espaço profundo');
    probe.querySelector('small').textContent = english ? 'SIGNAL' : 'SINAL';
    document.querySelector('.astro-standby-meta').textContent = english ? 'JV · DISTANT SIGNAL' : 'JV · SINAL DISTANTE';
    document.querySelector('#astro-standby-title').textContent = english ? 'Stand by for a signal' : 'Aguarde o sinal';
    document.querySelector('.astro-standby-note').textContent = english ? 'A new transmission is on its way.' : 'Uma nova transmissão está a caminho.';
    document.querySelector('[data-astro-standby-close]').textContent = english ? 'Back to the system' : 'Voltar ao sistema';
    sections.forEach((section, index) => {
      const name = english ? englishNames[index] : section.name;
      const bodyName = english ? englishBodies[index] : section.body;
      planetButtons[index].querySelector('.astro-planet-label').textContent = name;
      planetButtons[index].setAttribute('aria-label', `${name}, ${bodyName}`);
      dockButtons[index].lastChild.textContent = name;
    });
    if (persist) {
      try { localStorage.setItem('jv-portfolio-astro-language', language); } catch { /* Storage is optional. */ }
    }
    if (current !== null) openSection(current);
  }

  function openSection(index) {
    standby.hidden = true;
    current = (index + sections.length) % sections.length;
    const section = sections[current];
    panelContent.replaceChildren();
    if (language === 'en') renderEnglish(current);
    else section.render();
    panelContent.scrollTop = 0;
    document.querySelector('[data-astro-orbit]').textContent = current === 0 ? '☉ 00' : `${language === 'en' ? 'Orbit' : 'Órbita'} ${String(current).padStart(2, '0')}`;
    document.querySelector('[data-astro-body]').textContent = language === 'en' ? englishBodies[current] : section.body;
    document.querySelector('[data-astro-title]').textContent = language === 'en' ? englishNames[current] : section.name;
    view.classList.add('is-focused');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    planetButtons.forEach((button, number) => button.classList.toggle('is-active', number === current));
    dockButtons.forEach((button, number) => button.classList.toggle('is-active', number === current));
    dockButtons[current].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
    history.replaceState(null, '', `#astro-${section.id}`);
    renderScene();
  }

  function closeSection() {
    current = null;
    view.classList.remove('is-focused');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    planetButtons.forEach((button) => button.classList.remove('is-active'));
    dockButtons.forEach((button) => button.classList.remove('is-active'));
    if (location.hash.startsWith('#astro-')) history.replaceState(null, '', location.pathname + location.search);
    renderScene();
  }

  function showStandby() {
    closeSection();
    standby.hidden = false;
    document.querySelector('[data-astro-standby-close]').focus();
  }

  function hideStandby() {
    standby.hidden = true;
    probe.focus();
  }

  function setMode(mode, persist = false) {
    const astro = mode === 'astro';
    document.body.classList.toggle('astro-mode', astro);
    view.hidden = !astro;
    document.documentElement.lang = astro && language === 'en' ? 'en' : 'pt-BR';
    main.inert = astro;
    if (footer) footer.inert = astro;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.siteMode === mode)));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', astro ? '#050a12' : '#07111f');
    if (persist) {
      try { localStorage.setItem(storageKey, mode); } catch { /* Private mode can block storage. */ }
    }
    if (astro) {
      resize();
      startScene();
    } else {
      stopScene();
      standby.hidden = true;
      closeSection();
    }
  }

  buttons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.siteMode, true)));
  document.querySelectorAll('[data-astro-lang]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.astroLang, true)));
  document.querySelector('[data-astro-explore]').addEventListener('click', () => openSection(0));
  document.querySelector('[data-astro-close]').addEventListener('click', closeSection);
  document.querySelector('[data-astro-prev]').addEventListener('click', () => openSection((current ?? 0) - 1));
  document.querySelector('[data-astro-next]').addEventListener('click', () => openSection((current ?? 0) + 1));
  probe.addEventListener('click', showStandby);
  document.querySelector('[data-astro-standby-close]').addEventListener('click', hideStandby);
  document.querySelector('.site-header .logo').addEventListener('click', (event) => {
    if (!view.hidden) { event.preventDefault(); closeSection(); }
  });
  window.addEventListener('keydown', (event) => {
    if (view.hidden || event.target.closest('input, textarea')) return;
    if (event.key === 'Escape') {
      if (!standby.hidden) hideStandby();
      else closeSection();
    }
    if (event.key === 'ArrowRight') openSection(current === null ? 0 : current + 1);
    if (event.key === 'ArrowLeft') openSection(current === null ? sections.length - 1 : current - 1);
  });
  scene.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    pointer = { id: event.pointerId, x: event.clientX };
    scene.setPointerCapture(event.pointerId);
    scene.classList.add('is-dragging');
  });
  scene.addEventListener('pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    rotation += (event.clientX - pointer.x) * .007;
    pointer.x = event.clientX;
    if (reducedMotion) renderScene();
  });
  const endDrag = () => { pointer = null; scene.classList.remove('is-dragging'); };
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  scene.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoom = Math.max(.7, Math.min(1.55, zoom - event.deltaY * .0007));
    if (reducedMotion) renderScene();
  }, { passive: false });
  window.addEventListener('resize', () => { if (!view.hidden) resize(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopScene();
    else if (!view.hidden) startScene();
  });

  const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo' });
  const updateTime = () => { document.querySelector('[data-astro-readout]').textContent = `${timeFormat.format(new Date())} BRT`; };
  updateTime();
  setInterval(updateTime, 1000);

  let initialMode = 'normal';
  let initialLanguage = 'pt';
  try { if (localStorage.getItem(storageKey) === 'astro') initialMode = 'astro'; } catch { /* Storage is optional. */ }
  try { if (localStorage.getItem('jv-portfolio-astro-language') === 'en') initialLanguage = 'en'; } catch { /* Storage is optional. */ }
  setMode(initialMode);
  setLanguage(initialLanguage);
  if (initialMode === 'astro' && location.hash.startsWith('#astro-')) {
    const index = sections.findIndex((section) => location.hash === `#astro-${section.id}`);
    if (index >= 0) openSection(index);
  }
})();
