/* ==========================================================================
   RECOMEÇO — script.js
   Todo o comportamento interativo do site.

   Observação: o pequeno trecho que define o tema claro/escuro logo que a
   página começa a carregar continua inline no <head> do home.html (não
   aqui). Ele precisa rodar antes da primeira renderização para não gerar
   um "flash" do tema errado — e um arquivo externo carregado com "defer"
   sempre executa depois da página já estar montada, tarde demais para
   esse propósito específico.
   ========================================================================== */

/* ---------- Modo claro/escuro ---------- */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const aplicarEstadoBotaoTema = () => {
  const escuro = root.getAttribute('data-theme') === 'escuro';
  themeToggle.setAttribute('aria-pressed', String(escuro));
  themeToggle.setAttribute('aria-label', escuro ? 'Alternar para modo claro' : 'Alternar para modo escuro');
};
aplicarEstadoBotaoTema();

themeToggle.addEventListener('click', () => {
  const novoTema = root.getAttribute('data-theme') === 'escuro' ? 'claro' : 'escuro';
  root.setAttribute('data-theme', novoTema);
  localStorage.setItem('recomeco-tema', novoTema);
  aplicarEstadoBotaoTema();
});

/* ---------- Menu mobile ---------- */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Ano no rodapé ---------- */
document.getElementById('anoAtual').textContent = new Date().getFullYear();

/* ---------- Barra de progresso de leitura ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const atualizarProgresso = () => {
  const altura = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = altura > 0 ? (window.scrollY / altura) * 100 : 0;
  scrollProgress.style.width = progresso + '%';
};
document.addEventListener('scroll', atualizarProgresso, { passive: true });
atualizarProgresso();

/* ---------- Botão voltar ao topo ---------- */
const backToTop = document.getElementById('backToTop');
const alternarBotaoTopo = () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 600);
};
document.addEventListener('scroll', alternarBotaoTopo, { passive: true });
alternarBotaoTopo();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Copiar chave Pix ---------- */
document.querySelectorAll('.copy-btn').forEach(botao => {
  botao.addEventListener('click', async () => {
    const alvo = document.getElementById(botao.dataset.copyTarget);
    const texto = alvo ? alvo.textContent.trim() : '';
    const textoOriginal = botao.textContent;
    try {
      await navigator.clipboard.writeText(texto);
      botao.textContent = 'Copiado!';
    } catch (erro) {
      botao.textContent = 'Copie manualmente';
    }
    setTimeout(() => { botao.textContent = textoOriginal; }, 2000);
  });
});

/* ---------- Contagem animada das estatísticas ---------- */
const statNumbers = document.querySelectorAll('.stat-number');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCount = (el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (prefersReducedMotion) {
    el.textContent = target.toLocaleString('pt-BR');
    return;
  }
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

statNumbers.forEach(el => statsObserver.observe(el));

