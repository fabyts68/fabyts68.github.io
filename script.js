document.getElementById('y').textContent = new Date().getFullYear();
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// tema
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
document.getElementById('theme').addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// brilho que segue o mouse nos cartões
document.querySelectorAll('.glass').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// entrada suave ao rolar (o conteúdo já nasce visível)
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      // depois da entrada, devolve o cartão às transições normais de hover
      setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--d'); }, 1200);
    });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.s > *, .bento > *, .projects > *, .tl > *, .grp, .steps li').forEach((el, i) => {
    el.classList.add('rv');
    el.style.setProperty('--d', ((i % 4) * 70) + 'ms');
    io.observe(el);
  });
}

// pedido digitado na caixa do topo
const typed = document.getElementById('typed');
const phrases = [
  'Preciso automatizar a importação de notas fiscais.',
  'Quero um sistema que funcione mesmo sem internet.',
  'Tem uma vaga de dev júnior? Vamos conversar.'
];
if (typed && !reduce) {
  let p = 0, c = 0, del = false;
  const tick = () => {
    const full = phrases[p];
    c += del ? -1 : 1;
    typed.textContent = full.slice(0, c);
    let wait = del ? 22 : 48;
    if (!del && c === full.length) { del = true; wait = 1800; }
    else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; wait = 380; }
    setTimeout(tick, wait);
  };
  typed.textContent = '';
  setTimeout(tick, 900);
}
