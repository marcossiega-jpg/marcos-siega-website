/* ============================================
   MARCOS SIEGA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Mobile menu ---
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Stat counter animation ---
  const stats = document.querySelectorAll('.stat__number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => counterObserver.observe(stat));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Work filter ---
  const filterBtns = document.querySelectorAll('.work__filter');
  const workCards = document.querySelectorAll('.work__card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      workCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Contact form interaction ---
  const contactCards = document.getElementById('contactCards');
  const contactFormWrapper = document.getElementById('contactFormWrapper');
  const contactForm = document.getElementById('contactForm');
  const contactBack = document.getElementById('contactBack');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactReset = document.getElementById('contactReset');
  const formReason = document.getElementById('formReason');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const formCompanyGroup = document.getElementById('formCompanyGroup');
  const formSubmit = document.getElementById('formSubmit');

  const formConfig = {
    pitch: {
      title: 'Submit Your Pitch',
      subtitle: 'Tell me about your project or idea.',
      showCompany: true,
      showDisclaimer: true
    },
    collaborate: {
      title: "Let's Collaborate",
      subtitle: "What do you have in mind?",
      showCompany: true,
      showDisclaimer: false
    },
    hello: {
      title: 'Say Hello',
      subtitle: "Drop a line — I'd love to hear from you.",
      showCompany: false,
      showDisclaimer: false
    }
  };

  const disclaimerGroup = document.getElementById('formDisclaimerGroup');

  // Card click handlers
  contactCards.querySelectorAll('.contact__card').forEach(card => {
    card.addEventListener('click', () => {
      const reason = card.dataset.reason;
      const config = formConfig[reason];

      formReason.value = reason;
      formTitle.textContent = config.title;
      formSubtitle.textContent = config.subtitle;
      formCompanyGroup.style.display = config.showCompany ? 'block' : 'none';
      disclaimerGroup.style.display = config.showDisclaimer ? 'block' : 'none';
      const disclaimerCheckbox = document.getElementById('formDisclaimer');
      if (config.showDisclaimer) {
        disclaimerCheckbox.required = true;
      } else {
        disclaimerCheckbox.required = false;
        disclaimerCheckbox.checked = false;
      }

      contactCards.style.display = 'none';
      contactFormWrapper.classList.add('active');

      // Focus first field after animation
      setTimeout(() => {
        document.getElementById('formName').focus();
      }, 400);
    });

    // 3D tilt effect on hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Back button
  contactBack.addEventListener('click', () => {
    contactFormWrapper.classList.remove('active');
    contactCards.style.display = '';
    contactForm.reset();
  });

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    formSubmit.classList.add('btn--loading');
    formSubmit.disabled = true;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formSubmit.classList.remove('btn--loading');
        formSubmit.classList.add('btn--success');

        setTimeout(() => {
          contactFormWrapper.classList.remove('active');
          contactSuccess.classList.add('active');
        }, 800);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formSubmit.classList.remove('btn--loading');
      formSubmit.disabled = false;

      // Show inline error
      const errorMsg = document.createElement('p');
      errorMsg.style.cssText = 'color: #e74c3c; font-size: 0.85rem; margin-top: 0.5rem; text-align: center;';
      errorMsg.textContent = 'Something went wrong. Please try again or reach out directly.';
      formSubmit.parentNode.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 4000);
    }
  });

  // Reset contact
  contactReset.addEventListener('click', () => {
    contactSuccess.classList.remove('active');
    contactCards.style.display = '';
    contactForm.reset();
    formSubmit.classList.remove('btn--success', 'btn--loading');
    formSubmit.disabled = false;
  });

  // --- Parallax subtle glow on hero ---
  const hero = document.querySelector('.hero');

  if (hero && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      hero.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(158, 124, 32, 0.06) 0%, transparent 60%), var(--bg)`;
    });
  }

  // --- Video lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxIframe = document.getElementById('lightboxIframe');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = lightbox.querySelector('.lightbox__backdrop');

  document.querySelectorAll('.reel__card[data-video]').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.video;
      lightboxIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Stop playback
    lightboxIframe.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // --- Active nav link highlight on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));
});
