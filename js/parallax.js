/**
 * Alraees Travel Agency - Parallax & Continuous Bidirectional Scroll Motion Engine
 * - Cloud background zoom-out on scroll
 * - Plane image zoom-in & smooth rightward glide on scroll (Zero shadows)
 * - Bidirectional (Up & Down) scroll reveals for all components and texts every time
 * - 3D Perspective Card Tilt
 */

(function() {
  'use strict';

  // DOM Elements
  const cloudBg = document.getElementById('heroCloudBg');
  const planeWrap = document.getElementById('heroPlaneWrap');
  const heroSection = document.getElementById('hero');
  const watermarkText = document.getElementById('footerWatermark');

  // Parallax & Scroll Direction Tracking
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let ticking = false;

  /**
   * Continuous Parallax & Scroll Physics Update
   */
  function updateParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    
    // Calculate scroll progress within hero view (0.0 to 1.0)
    const progress = Math.min(Math.max(scrollY / (heroHeight * 0.9), 0), 1);

    // 1. Cloudy Background: Zoom out smoothly from 1.20 down to 1.00 on scroll
    const targetCloudScale = 1.20 - (progress * 0.20);
    const cloudTranslateY = scrollY * 0.16; // subtle parallax depth
    
    if (cloudBg) {
      cloudBg.style.transform = `translate3d(0, ${cloudTranslateY}px, 0) scale(${targetCloudScale})`;
    }

    // 2. Airplane: Zoom in from 1.00 up to 1.45 and move smoothly to the right side (translateX up to 280px)
    const targetPlaneScale = 1.0 + (progress * 0.45);
    const planeShiftX = progress * 280; // Moves noticeably and smoothly to the right
    const planeShiftY = -progress * 30;
    const planeRotate = -progress * 1.5;

    if (planeWrap) {
      planeWrap.style.transform = `translate3d(${planeShiftX}px, ${planeShiftY}px, 0) scale(${targetPlaneScale}) rotate(${planeRotate}deg)`;
      planeWrap.style.filter = 'none'; // strictly zero drop-shadow
    }

    // 3. Footer Watermark letter-spacing dynamic motion
    if (watermarkText) {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const bottomProgress = Math.min(Math.max((scrollY - (scrollTotal - 700)) / 700, 0), 1);
        const spacing = 4 + (bottomProgress * 8);
        watermarkText.style.letterSpacing = `${spacing}px`;
      }
    }

    // Check bidirectional reveals
    checkBidirectionalReveals();

    lastScrollY = scrollY;
    ticking = false;
  }

  /**
   * RequestAnimationFrame Scroll Loop
   */
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  /**
   * Bidirectional Scroll Reveals (Triggering smoothly when scrolling Up and Down EVERY TIME)
   */
  let revealElements = [];

  function initBidirectionalScrollReveals() {
    const revealSelectors = '.scroll-reveal-item, .scroll-reveal-text, .scroll-reveal-left, .scroll-reveal-right';
    revealElements = Array.from(document.querySelectorAll(revealSelectors));
    checkBidirectionalReveals();
  }

  function checkBidirectionalReveals() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const topMargin = 40;
    const bottomMargin = windowHeight - 30;

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Element is visible in viewport window
      if (rect.top < bottomMargin && rect.bottom > topMargin) {
        el.classList.add('in-view');
      } else {
        // Element is outside viewport -> remove in-view so it animates smoothly when re-entering
        el.classList.remove('in-view');
      }
    });
  }

  /**
   * Buttery-Smooth 3D Perspective Card Tilt
   */
  function initCardTilt() {
    const cards = document.querySelectorAll('.deal-card, .hero-thumb-card, .dest-card-image-box, .stay-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Active navigation highlight on scroll
  function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const scrollPos = (window.pageYOffset || document.documentElement.scrollTop) + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
    window.addEventListener('resize', () => {
      onScroll();
      updateActiveNavOnScroll();
    }, { passive: true });
    
    initBidirectionalScrollReveals();
    initCardTilt();
    updateParallax();
  });

})();
