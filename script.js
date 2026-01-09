// Toggle Dark/Light
const toggleSwitch = document.getElementById('themeToggle');
const setTheme = (dark) => {
  document.body.className = dark ? 'dark' : 'light';
};
let isDark = true; setTheme(isDark);
if (toggleSwitch) {
  toggleSwitch.checked = isDark;
  toggleSwitch.addEventListener('change', ()=>{ 
    isDark = toggleSwitch.checked; 
    setTheme(isDark); 
  });
}

// Scroll dolce ai progetti
const projectsButton = document.getElementById('goProjects');
if (projectsButton) {
  projectsButton.addEventListener('click', ()=>{
    document.getElementById('projects').scrollIntoView({behavior:'smooth'});
  });
}

// Parallax orb (subtle)
(() => {
  const orb = document.querySelector('.orb');
  if(!orb) return;
  const strength = 12; // px max
  const moveOrb = (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    const x = (e.clientX / w - .5) * 2; // -1..1
    const y = (e.clientY / h - .5) * 2;
    orb.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
  };
  const resetOrb = () => { 
    orb.style.transform = 'translate(0,0)'; 
  };
  window.addEventListener('pointermove', moveOrb);
  window.addEventListener('pointerleave', resetOrb);
})();

// Magnetic hover sul bottone
(() => {
  const b = document.getElementById('goProjects');
  if(!b) return;
  const max = 6; // px
  b.addEventListener('pointermove', (e)=>{
    const r = b.getBoundingClientRect();
    const x = ((e.clientX - r.left)/r.width - .5) * 2;
    const y = ((e.clientY - r.top )/r.height - .5) * 2;
    b.style.transform = `translate(${x*max}px, ${y*max}px)`;
  });
  b.addEventListener('pointerleave', ()=>{ b.style.transform = ''; });
})();

(() => {
  const tooltips = Array.from(document.querySelectorAll('#projects .tilted-card-caption'));
  tooltips.forEach((el) => el.remove());
})();

(() => {
  const projectLinks = Array.from(document.querySelectorAll('#projects .project-link'));
  if (!projectLinks.length) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    projectLinks.forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    projectLinks.forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  projectLinks.forEach((el, index) => {
    el.classList.add('reveal-item');
    el.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
  });

  requestAnimationFrame(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          requestAnimationFrame(() => {
            entry.target.classList.add('is-visible');
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    projectLinks.forEach((el) => observer.observe(el));
  });
})();

(() => {
  const root = document.getElementById('curvedLoop');
  if (!root) return;

  const svg = root.querySelector('.curved-loop-svg');
  const measureEl = root.querySelector('.curved-loop-measure');
  const textPath = root.querySelector('textPath');
  if (!svg || !measureEl || !textPath) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rawText = root.getAttribute('data-text') || '';
  const baseText = (/\s|\u00A0$/.test(rawText) ? rawText.replace(/\s+$/, '') : rawText) + '\u00A0';

  measureEl.innerHTML = '';
  measureEl.appendChild(document.createTextNode(baseText));

  const getSpacing = () => {
    try {
      return measureEl.getComputedTextLength();
    } catch {
      return 0;
    }
  };

  let spacing = 0;
  let offset = 0;
  let frame = 0;

  const updateText = () => {
    spacing = getSpacing();
    if (!spacing) {
      root.style.visibility = 'visible';
      return;
    }

    const repeats = Math.ceil(1800 / spacing) + 2;
    const total = Array(repeats).fill(baseText).join('');
    textPath.textContent = total;

    offset = -spacing;
    textPath.setAttribute('startOffset', `${offset}px`);
    root.style.visibility = 'visible';
  };

  root.style.visibility = 'visible';
  requestAnimationFrame(updateText);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateText();
    });
  }
  window.addEventListener('resize', updateText);

  if (prefersReducedMotion) return;

  let drag = false;
  let lastX = 0;
  let direction = 'left';
  let speed = 2.2;
  let vel = 0;

  const step = () => {
    if (spacing && !drag) {
      const delta = direction === 'right' ? speed : -speed;
      offset += delta;
      const wrapPoint = spacing;
      if (offset <= -wrapPoint) offset += wrapPoint;
      if (offset > 0) offset -= wrapPoint;
      textPath.setAttribute('startOffset', `${offset}px`);
    }
    frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);

  const onPointerDown = (e) => {
    drag = true;
    lastX = e.clientX;
    vel = 0;
    root.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag || !spacing) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx;
    offset += dx;
    const wrapPoint = spacing;
    if (offset <= -wrapPoint) offset += wrapPoint;
    if (offset > 0) offset -= wrapPoint;
    textPath.setAttribute('startOffset', `${offset}px`);
  };

  const endDrag = () => {
    drag = false;
    direction = vel > 0 ? 'right' : 'left';
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', endDrag);
  root.addEventListener('pointerleave', endDrag);

  window.addEventListener('beforeunload', () => cancelAnimationFrame(frame));
})();
