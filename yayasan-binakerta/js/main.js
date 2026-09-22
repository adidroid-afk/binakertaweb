// Yayasan Binakerta Utama - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile menu if open
        navLinks.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove('active');
        }
      }
    });
  });

  // Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check on initial load

  // Counter Animation for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    if (animated) return;

    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      animated = true;

      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
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
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters(); // Check on initial load

  // Program Cards Click Navigation
  const programCards = document.querySelectorAll('.program-card');
  programCards.forEach(card => {
    card.addEventListener('click', function() {
      const link = this.querySelector('.program-link');
      if (link && link.href) {
        window.location.href = link.href;
      }
    });
  });

  // Gallery Lightbox (Simple Implementation)
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      const title = this.querySelector('.gallery-overlay h4');
      
      if (img && title) {
        createLightbox(img.src, title.textContent);
      }
    });
  });

  function createLightbox(src, title) {
    // Remove existing lightbox if any
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) {
      existingLightbox.remove();
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close">&times;</span>
        <img src="${src}" alt="${title}">
        <p class="lightbox-title">${title}</p>
      </div>
    `;

    // Add lightbox styles
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    `;

    const lightboxContent = lightbox.querySelector('.lightbox-content');
    lightboxContent.style.cssText = `
      position: relative;
      max-width: 90%;
      max-height: 90%;
    `;

    const lightboxImg = lightbox.querySelector('img');
    lightboxImg.style.cssText = `
      max-width: 100%;
      max-height: 80vh;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    `;

    const lightboxClose = lightbox.querySelector('.lightbox-close');
    lightboxClose.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      font-size: 40px;
      color: white;
      cursor: pointer;
      transition: transform 0.3s ease;
    `;

    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    lightboxTitle.style.cssText = `
      color: white;
      text-align: center;
      margin-top: 15px;
      font-size: 1.2rem;
    `;

    // Close lightbox on click
    lightboxClose.addEventListener('click', function() {
      lightbox.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => lightbox.remove(), 300);
    });

    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => lightbox.remove(), 300);
      }
    });

    document.body.appendChild(lightbox);
  }

  // Form Submission Handler
  const contactForm = document.querySelector('.contact-form form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Simple validation
      if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Donation Form Handler
  const donationForm = document.querySelector('.donation-form form');
  
  if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      if (!data.amount || !data.donorName || !data.email) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification(`Thank you for your generous donation of Rp ${data.amount}!`, 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Notification System
  function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#A8D5BA' : type === 'error' ? '#E8B4B8' : '#F4E8D8'};
      color: #4A4A4A;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 3000;
      animation: slideInRight 0.3s ease;
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Add keyframe animations for notifications
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

  // Active Navigation Link
  const currentPage = window.location.pathname;
  const navLinksList = document.querySelectorAll('.nav-links a');
  
  navLinksList.forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
      link.classList.add('active');
    }
  });

  // Parallax Effect for Hero Section
  const hero = document.querySelector('.hero');
  
  if (hero) {
    window.addEventListener('scroll', function() {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
      }
    });
  }

  // Team Member Hover Effect Enhancement
  const teamMembers = document.querySelectorAll('.team-member');
  
  teamMembers.forEach(member => {
    member.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    member.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Lazy Loading Images
  const images = document.querySelectorAll('img[data-src]');
  
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

  console.log('Yayasan Binakerta Utama - Website Loaded Successfully!');
});
