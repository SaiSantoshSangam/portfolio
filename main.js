(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const copyButton = document.getElementById('copy-email');
  const toast = document.querySelector('.toast');
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const email = copyButton.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard');
      } catch {
        const helper = document.createElement('textarea');
        helper.value = email;
        helper.setAttribute('readonly', '');
        helper.style.position = 'absolute';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        showToast(copied ? 'Email copied to clipboard' : email);
      }
    });
  }

  // Interactive 3D mouse parallax on hero portrait & floating chips
  const hero = document.querySelector('.hero');
  const heroCore = document.querySelector('.hero-portrait-core');
  const floatChips = document.querySelectorAll('.float-chip');
  if (hero && heroCore && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCore.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
      floatChips.forEach((chip, i) => {
        const factor = (i + 1) * 7;
        chip.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      heroCore.style.transform = '';
      floatChips.forEach(chip => chip.style.transform = '');
    });
  }

  // Active navigation link tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');
  if (sections.length && navAnchorLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.scrollY + 140;
      sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
          current = section.getAttribute('id');
        }
      });
      navAnchorLinks.forEach(link => {
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }, { passive: true });
  }

  // Contact & Email Modal functionality
  const contactModal = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close');
  const emailTriggers = document.querySelectorAll('.email-trigger');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const quickEmailForm = document.getElementById('quick-email-form');
  const submitMailApp = document.getElementById('submit-mailapp');

  const TARGET_EMAIL = 'sangamsaisantosh@gmail.com';

  function openModal() {
    if (!contactModal) return;
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!contactModal) return;
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  emailTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(TARGET_EMAIL);
        showToast('Email copied: ' + TARGET_EMAIL);
      } catch {
        showToast(TARGET_EMAIL);
      }
    });
  }

  function getComposeData() {
    const name = document.getElementById('form-name')?.value.trim() || 'Visitor';
    const subject = document.getElementById('form-subject')?.value.trim() || 'AI Engineering Opportunity';
    const message = document.getElementById('form-message')?.value.trim() || '';
    const fullBody = `Hi Sangam Sai Santosh,\n\n${message}\n\nBest regards,\n${name}`;
    return { subject, fullBody };
  }

  // Submit via Gmail
  if (quickEmailForm) {
    quickEmailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { subject, fullBody } = getComposeData();
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening Gmail compose...');
      closeModal();
    });
  }

  // Submit via Mail App
  if (submitMailApp) {
    submitMailApp.addEventListener('click', (e) => {
      e.preventDefault();
      const { subject, fullBody } = getComposeData();
      const mailtoUrl = `mailto:${encodeURIComponent(TARGET_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
      window.location.href = mailtoUrl;
      showToast('Opening email client...');
      closeModal();
    });
  }
})();