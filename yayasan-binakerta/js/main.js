/**
 * Yayasan Binakerta Utama - Main Application Module
 * Organized into logical sections for better maintainability
 */

const App = (() => {
  'use strict';

  // Configuration
  const CONFIG = {
    scrollThreshold: 100,
    revealOffset: 100,
    counterDuration: 2000,
    notificationTimeout: 4000,
    parallaxMaxScroll: 600
  };

  // Cache DOM elements
  const DOM = {};

  /**
   * Initialize cached DOM elements
   */
  const cacheElements = () => {
    DOM.elements = {
      mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
      navLinks: document.querySelector('.nav-links'),
      header: document.querySelector('header'),
      hero: document.querySelector('.hero'),
      contactForm: document.querySelector('.contact-form form'),
      donationForm: document.querySelector('.donation-form form'),
      statNumbers: document.querySelectorAll('.stat-number'),
      statsSection: document.querySelector('.stats-grid')
    };
  };

  /**
   * Mobile Menu Toggle
   */
  const initMobileMenu = () => {
    const { mobileMenuBtn, navLinks } = DOM.elements;
    
    if (!mobileMenuBtn || !navLinks) return;

    const toggleMenu = () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);
  };

  /**
   * Header Scroll Effect
   */
  const initHeaderScroll = () => {
    const { header } = DOM.elements;
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('header-scrolled', window.scrollY > CONFIG.scrollThreshold);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  /**
   * Smooth Scrolling for Anchor Links
   */
  const initSmoothScroll = () => {
    const { navLinks } = DOM.elements;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove('active');
        if (DOM.elements.mobileMenuBtn) {
          DOM.elements.mobileMenuBtn.classList.remove('active');
        }
      });
    });
  };

  /**
   * Reveal Animations on Scroll
   */
  const initRevealAnimations = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const checkReveal = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < window.innerHeight - CONFIG.revealOffset) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal(); // Initial check
  };

  /**
   * Counter Animation for Stats
   */
  const initCounterAnimation = () => {
    const { statNumbers, statsSection } = DOM.elements;
    if (!statNumbers.length || !statsSection) return;

    let animated = false;

    const animateCounter = (stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const increment = target / (CONFIG.counterDuration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    const checkAndAnimate = () => {
      if (animated) return;

      const sectionTop = statsSection.getBoundingClientRect().top;
      
      if (sectionTop < window.innerHeight - CONFIG.revealOffset) {
        animated = true;
        statNumbers.forEach(animateCounter);
      }
    };

    window.addEventListener('scroll', checkAndAnimate, { passive: true });
    checkAndAnimate(); // Initial check
  };

  /**
   * Program Cards Click Navigation
   */
  const initProgramCards = () => {
    document.querySelectorAll('.program-card').forEach(card => {
      card.addEventListener('click', function() {
        const link = this.querySelector('.program-link');
        if (link?.href) {
          window.location.href = link.href;
        }
      });
    });
  };

  /**
   * Gallery Lightbox
   */
  const initLightbox = () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    const createLightbox = (src, title) => {
      // Remove existing lightbox
      const existingLightbox = document.querySelector('.lightbox');
      if (existingLightbox) existingLightbox.remove();

      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img src="${src}" alt="${title}">
          <p class="lightbox-title">${title}</p>
        </div>
      `;

      // Add styles
      Object.assign(lightbox.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease'
      });

      const lightboxContent = lightbox.querySelector('.lightbox-content');
      Object.assign(lightboxContent.style, {
        position: 'relative',
        maxWidth: '90%',
        maxHeight: '90%'
      });

      const lightboxImg = lightbox.querySelector('img');
      Object.assign(lightboxImg.style, {
        maxWidth: '100%',
        maxHeight: '80vh',
        borderRadius: '10px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
      });

      const lightboxClose = lightbox.querySelector('.lightbox-close');
      Object.assign(lightboxClose.style, {
        position: 'absolute',
        top: '-40px',
        right: 0,
        fontSize: '40px',
        color: 'white',
        cursor: 'pointer',
        transition: 'transform 0.3s ease'
      });

      const lightboxTitle = lightbox.querySelector('.lightbox-title');
      Object.assign(lightboxTitle.style, {
        color: 'white',
        textAlign: 'center',
        marginTop: '15px',
        fontSize: '1.2rem'
      });

      const closeLightbox = () => {
        lightbox.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => lightbox.remove(), 300);
      };

      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.body.appendChild(lightbox);
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('.gallery-overlay h4');
        
        if (img && title) {
          createLightbox(img.src, title.textContent);
        }
      });
    });
  };

  /**
   * Notification System
   */
  const showNotification = (message, type = 'info') => {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const colors = {
      success: '#A8D5BA',
      error: '#E8B4B8',
      info: '#F4E8D8'
    };

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      background: colors[type] || colors.info,
      color: '#4A4A4A',
      padding: '15px 25px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 3000,
      animation: 'slideInRight 0.3s ease',
      fontWeight: '600'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, CONFIG.notificationTimeout);
  };

  /**
   * Form Handler (Generic)
   */
  const initFormHandler = (formSelector, validateFn, successMessage) => {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Validate
      if (!validateFn(data)) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent || '';
      
      // Set loading state
      if (submitBtn) {
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showNotification(successMessage(data), 'success');
      this.reset();
      
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  };

  /**
   * Initialize Contact Form
   */
  const initContactForm = () => {
    initFormHandler(
      '.contact-form form',
      (data) => data.name && data.email && data.message,
      () => 'Thank you! Your message has been sent successfully.'
    );
  };

  /**
   * Initialize Donation Form
   */
  const initDonationForm = () => {
    initFormHandler(
      '.donation-form form',
      (data) => data.amount && data.donorName && data.email,
      (data) => `Thank you for your generous donation of Rp ${data.amount}!`
    );
  };

  /**
   * Active Navigation Link
   */
  const initActiveNavigation = () => {
    const currentPage = window.location.pathname;
    
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || 
          (currentPage.includes(href) && href !== '/')) {
        link.classList.add('active');
      }
    });
  };

  /**
   * Parallax Effect for Hero Section
   */
  const initParallax = () => {
    const { hero } = DOM.elements;
    if (!hero) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < CONFIG.parallaxMaxScroll) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  /**
   * Team Member Hover Effects
   */
  const initTeamHoverEffects = () => {
    document.querySelectorAll('.team-member').forEach(member => {
      member.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      member.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  };

  /**
   * Lazy Loading Images
   */
  const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  };

  /**
   * Add Notification Animation Styles
   */
  const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Log initialization
   */
  const logInitialization = () => {
    console.log('Yayasan Binakerta Utama - Website Loaded Successfully!');
  };

  /**
   * Initialize all modules
   */
  const init = () => {
    cacheElements();
    addAnimationStyles();
    
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
    
    logInitialization();
  };

  // Public API
  return {
    init,
    showNotification
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
