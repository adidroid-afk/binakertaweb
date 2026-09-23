// Yayasan Binakerta Utama - Main JavaScript (Flat Version)

'use strict';

/**
 * Main Application Module
 * Encapsulates all functionality to avoid global scope pollution
 */
(function() {
  // Configuration
  const CONFIG = {
    SCROLL_THRESHOLD: 50,
    REVEAL_THRESHOLD: 0.1,
    COUNTER_DURATION: 2000,
    MOBILE_BREAKPOINT: 768,
    NOTIFICATION_DURATION: 5000
  };

  // Cached DOM elements
  let elements = {};

  /**
   * Cache frequently accessed DOM elements
   */
  function cacheElements() {
    elements = {
      header: document.querySelector('header'),
      mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
      navLinks: document.querySelector('.nav-links'),
      statNumbers: document.querySelectorAll('.stat-number'),
      revealElements: document.querySelectorAll('.reveal'),
      programCards: document.querySelectorAll('.program-card'),
      galleryItems: document.querySelectorAll('.gallery-item'),
      contactForm: document.querySelector('.contact-form'),
      donationForm: document.querySelector('.donation-form')
    };
  }

  /**
   * Initialize mobile menu toggle
   */
  function initMobileMenu() {
    if (!elements.mobileMenuBtn || !elements.navLinks) return;

    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.navLinks.classList.toggle('active');
      elements.mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        elements.navLinks.classList.remove('active');
        elements.mobileMenuBtn.classList.remove('active');
      });
    });
  }

  /**
   * Handle header scroll effect
   */
  function initHeaderScroll() {
    if (!elements.header) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
            elements.header.classList.add('header-scrolled');
          } else {
            elements.header.classList.remove('header-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /**
   * Reveal animations on scroll
   */
  function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: CONFIG.REVEAL_THRESHOLD });

    elements.revealElements.forEach(el => observer.observe(el));
  }

  /**
   * Counter animation for statistics
   */
  function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    elements.statNumbers.forEach(stat => observer.observe(stat));
  }

  /**
   * Animate individual counter
   * @param {HTMLElement} element - The counter element
   */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = CONFIG.COUNTER_DURATION;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString('id-ID');
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString('id-ID');
      }
    };

    updateCounter();
  }

  /**
   * Program card hover effects
   */
  function initProgramCards() {
    elements.programCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        elements.programCards.forEach(c => {
          if (c !== card) {
            c.style.opacity = '0.7';
          }
        });
      });

      card.addEventListener('mouseleave', function() {
        elements.programCards.forEach(c => {
          c.style.opacity = '1';
        });
      });
    });
  }

  /**
   * Lightbox functionality for gallery
   */
  function initLightbox() {
    elements.galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('h4')?.textContent || '';
        const description = this.querySelector('p')?.textContent || '';
        
        showLightbox(img.src, title, description);
      });
    });
  }

  /**
   * Show lightbox modal
   * @param {string} src - Image source
   * @param {string} title - Image title
   * @param {string} description - Image description
   */
  function showLightbox(src, title, description) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <img src="${src}" alt="${title}">
        ${title ? `<h3>${title}</h3>` : ''}
        ${description ? `<p>${description}</p>` : ''}
      </div>
    `;

    document.body.appendChild(lightbox);

    setTimeout(() => lightbox.classList.add('active'), 10);

    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      closeLightbox(lightbox);
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox(lightbox);
      }
    });
  }

  /**
   * Close lightbox modal
   * @param {HTMLElement} lightbox - The lightbox element
   */
  function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    setTimeout(() => lightbox.remove(), 300);
  }

  /**
   * Contact form handler
   */
  function initContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(elements.contactForm);
      const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.', 'success');
        elements.contactForm.reset();
      } catch (error) {
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /**
   * Donation form handler
   */
  function initDonationForm() {
    if (!elements.donationForm) return;

    elements.donationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(elements.donationForm);
      const submitBtn = elements.donationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('Terima kasih atas donasi Anda! Instruksi pembayaran telah dikirim.', 'success');
        elements.donationForm.reset();
      } catch (error) {
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /**
   * Show notification toast
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success/error)
   */
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, CONFIG.NOTIFICATION_DURATION);
  }

  /**
   * Active navigation highlighting
   */
  function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 100;

          sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                  link.classList.add('active');
                }
              });
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Parallax effect for hero section
   */
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Team member hover effects
   */
  function initTeamHoverEffects() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
      member.addEventListener('mouseenter', function() {
        teamMembers.forEach(m => {
          if (m !== member) {
            m.style.filter = 'grayscale(100%)';
            m.style.opacity = '0.6';
          }
        });
      });

      member.addEventListener('mouseleave', function() {
        teamMembers.forEach(m => {
          m.style.filter = 'grayscale(0)';
          m.style.opacity = '1';
        });
      });
    });
  }

  /**
   * Lazy loading for images
   */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /**
   * Add custom styles for lightbox and notifications
   */
  function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 61, 40, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .lightbox.active {
        opacity: 1;
      }
      
      .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
      }
      
      .lightbox-content img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      }
      
      .lightbox-content h3 {
        color: #FEF3C7;
        margin-top: 20px;
        font-size: 1.5rem;
      }
      
      .lightbox-content p {
        color: rgba(254, 243, 199, 0.8);
        margin-top: 10px;
      }
      
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: #FEF3C7;
        font-size: 3rem;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      
      .lightbox-close:hover {
        transform: scale(1.2);
      }
      
      .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: #1E5F3E;
        color: #FFFFFF;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(30, 95, 62, 0.4);
        z-index: 3000;
        transform: translateX(150%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification-success {
        background: linear-gradient(135deg, #1E5F3E, #2D8A5A);
      }
      
      .notification-error {
        background: linear-gradient(135deg, #DC2626, #EF4444);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize all modules
   */
  function init() {
    cacheElements();
    addCustomStyles();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initRevealAnimations();
    initCounterAnimation();
    initProgramCards();
    initLightbox();
    initContactForm();
    initDonationForm();
    initActiveNavigation();
    initParallax();
    initTeamHoverEffects();
    initLazyLoading();
    
    console.log('Yayasan Binakerta Utama website initialized successfully');
  }

  // Expose public API
  window.YBUApp = {
    init: init,
    showNotification: showNotification
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
