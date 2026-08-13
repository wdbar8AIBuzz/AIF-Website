/* =========================================================
   AIF — interactions
   Navbar · mobile menu · rewriting headline · scroll reveals
   ========================================================= */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Navbar scroll hairline ---- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
    hamburger.classList.toggle('open', !isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
      hamburger.classList.remove('open');
    });
  });
}

/* ---- Active nav link ---- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

/* ---- Rewriting headline (signature) ----
   "AI is rewriting finance." — the last word literally rewrites itself. */
const rewriteEl = document.getElementById('rewriteWord');
if (rewriteEl) {
  const words = ['finance.', 'markets.', 'investing.', 'research.', 'careers.'];
  if (prefersReduced) {
    rewriteEl.textContent = words[0];
  } else {
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = false;
    rewriteEl.textContent = words[0];

    const tick = () => {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        rewriteEl.textContent = word.slice(0, charIndex);
        if (charIndex >= word.length) {
          deleting = true;
          setTimeout(tick, 2600); // hold the finished word
          return;
        }
        setTimeout(tick, 70);
      } else {
        charIndex--;
        rewriteEl.textContent = word.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 320);
          return;
        }
        setTimeout(tick, 42);
      }
    };
    setTimeout(tick, 2600);
  }
}

/* ---- Ticker: duplicate content for a seamless loop ---- */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack && tickerTrack.children.length === 1) {
  tickerTrack.appendChild(tickerTrack.children[0].cloneNode(true));
}

/* ---- Scroll reveals ---- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window && !prefersReduced) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ---- Interest form ---- */
const form = document.getElementById('joinForm');
const submitFrame = document.getElementById('aif-submit-frame');
if (form && submitFrame) {
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  let submissionInProgress = false;

  form.addEventListener('submit', () => {
    if (!form.checkValidity()) return;
    submissionInProgress = true;
    btn.textContent = 'Sending...';
    btn.disabled = true;
  });

  submitFrame.addEventListener('load', () => {
    if (!submissionInProgress) return;
    submissionInProgress = false;
    form.reset();
    btn.textContent = 'Thank you!';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 3200);
  });
}
