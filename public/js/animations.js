document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateSections = document.querySelectorAll('.animate-section');
  animateSections.forEach(section => {
    observer.observe(section);
  });

  const lazyLoadSections = document.querySelectorAll('[data-animate="lazy"]');
  lazyLoadSections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 100 * index);
  });

  const staggerItems = document.querySelectorAll('[data-stagger]');
  if (staggerItems.length > 0) {
    staggerItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 150 * index);
    });
  }

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

