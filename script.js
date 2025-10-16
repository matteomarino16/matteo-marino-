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

// Tilt 3D sulle card
(() => {
  const cards = document.querySelectorAll('.card');
  const limit = 8; // deg
  cards.forEach(card=>{
    card.addEventListener('pointermove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left)/r.width - .5) * 2;
      const y = ((e.clientY - r.top )/r.height - .5) * 2;
      card.style.transform = `rotateY(${x*limit}deg) rotateX(${ -y*limit}deg)`;
    });
    card.addEventListener('pointerleave', ()=>{ card.style.transform = ''; });
  });
})();
