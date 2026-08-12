// ===== Gonda Rasoi — site script =====
document.addEventListener('DOMContentLoaded', () => {

  /* Sticky header shrink */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    const backTop = document.querySelector('.back-top');
    if (backTop) backTop.classList.toggle('show', window.scrollY > 480);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
    }));
  }

  /* Back to top */
  const backTop = document.querySelector('.back-top');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in'), (entry.target.dataset.delay || 0));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Animated counters */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length) {
    const cIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = el.dataset.count.includes('.') ? 1 : 0;
        const dur = 1400, start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cIo.observe(c));
  }

  /* Gallery lightbox */
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  const lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    const lbImg = lightbox.querySelector('img');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lbImg.src = item.dataset.lightbox;
        lbImg.alt = item.dataset.caption || '';
        lightbox.classList.add('active');
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target !== lbImg) lightbox.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('active'); });
  }

  /* Donation amount selector (contact / donate page) */
  const amtBtns = document.querySelectorAll('.amt-btn');
  const amtCustom = document.getElementById('customAmount');
  const donateBtnLabel = document.getElementById('donateAmountLabel');
  const impactLine = document.getElementById('impactLine');
  function setAmount(v) {
    amtBtns.forEach(b => b.classList.toggle('active', b.dataset.value == v));
    if (donateBtnLabel) donateBtnLabel.textContent = '₹' + Number(v).toLocaleString('en-IN');
    if (impactLine) {
      const meals = Math.max(1, Math.round(v / 30));
      impactLine.textContent = 'आपका योगदान लगभग ' + meals.toLocaleString('en-IN') + ' थाली भोजन में मदद कर सकता है।';
    }
  }
  amtBtns.forEach(b => b.addEventListener('click', () => { setAmount(b.dataset.value); if (amtCustom) amtCustom.value = ''; }));
  if (amtCustom) amtCustom.addEventListener('input', (e) => { if (e.target.value) setAmount(e.target.value); });
  if (amtBtns.length) setAmount(amtBtns[1] ? amtBtns[1].dataset.value : amtBtns[0].dataset.value);

  /* Copy-to-clipboard for bank details */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy || '';
      navigator.clipboard?.writeText(text).then(() => {
        const old = btn.textContent;
        btn.textContent = 'कॉपी हुआ ✓';
        setTimeout(() => btn.textContent = old, 1500);
      });
    });
  });

  /* Contact / donate demo form */
  const donateForm = document.getElementById('donateForm');
  if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      if (msg) {
        msg.classList.remove('hidden');
        msg.textContent = 'धन्यवाद! कृपया नीचे दिए गए बैंक विवरण या QR कोड से भुगतान करें और स्क्रीनशॉट WhatsApp पर भेजें: 7379761111';
      }
    });
  }

});
