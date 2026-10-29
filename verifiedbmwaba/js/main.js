// ========================================
// VerifiedBMandWABA - Main JavaScript
// Theme Toggle, Animations, Interactions
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Theme Management
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  
  // Auto-detect system theme preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme
  function applyTheme(theme) {
    if (theme === 'light') {
      htmlElement.setAttribute('data-theme', 'light');
    } else {
      htmlElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
  }
  
  // Update theme toggle icon
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);
  
  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
      }
    });
  }
  
  // Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = scrollPercentage + '%';
    });
  }
  
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(function(otherItem) {
          otherItem.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
  
  // Scroll Reveal Animation
  const fadeElements = document.querySelectorAll('.fade-in');
  
  function checkFadeElements() {
    fadeElements.forEach(function(el) {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        el.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkFadeElements();
  
  // Check on scroll
  window.addEventListener('scroll', checkFadeElements);
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
          }
        }
      }
    });
  });
  
  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() === '#0a0a0c' 
          ? 'rgba(10, 10, 12, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)';
      } else {
        navbar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() === '#0a0a0c'
          ? 'rgba(10, 10, 12, 0.8)'
          : 'rgba(255, 255, 255, 0.8)';
      }
    });
  }
  
  // Product Card 3D Tilt Effect
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
  
  // Form Validation (for contact page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      let isValid = true;
      
      if (name && name.value.trim() === '') {
        isValid = false;
        name.style.borderColor = 'var(--error)';
      } else if (name) {
        name.style.borderColor = 'var(--border-color)';
      }
      
      if (email && !isValidEmail(email.value)) {
        isValid = false;
        email.style.borderColor = 'var(--error)';
      } else if (email) {
        email.style.borderColor = 'var(--border-color)';
      }
      
      if (message && message.value.trim() === '') {
        isValid = false;
        message.style.borderColor = 'var(--error)';
      } else if (message) {
        message.style.borderColor = 'var(--border-color)';
      }
      
      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields correctly.');
      }
    });
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Dynamic Year in Footer
  const yearElements = document.querySelectorAll('.current-year');
  yearElements.forEach(function(el) {
    el.textContent = new Date().getFullYear();
  });
  
  // Active Navigation Link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksList = document.querySelectorAll('.nav-links a');
  navLinksList.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
});

// Product Data for Dynamic Product Pages
const products = {
  'verified-business-manager': {
    id: 'verified-business-manager',
    title: 'Verified Business Manager',
    price: '$299',
    description: 'Get a fully verified Facebook Business Manager account ready for advertising campaigns.',
    features: [
      'Fully verified BM account',
      'Ready for ad campaigns',
      '90-day warranty',
      '24/7 support',
      'Instant delivery'
    ],
    image: '💼',
    category: 'Business Manager'
  },
  'verified-whatsapp-business': {
    id: 'verified-whatsapp-business',
    title: 'Verified WhatsApp Business API',
    price: '$199',
    description: 'Official verified WhatsApp Business API account with green tick verification.',
    features: [
      'Green tick verification',
      'WhatsApp Business API',
      'Unlimited messaging',
      'Catalog setup',
      'Priority support'
    ],
    image: '📱',
    category: 'WhatsApp'
  },
  'bm-with-ad-account': {
    id: 'bm-with-ad-account',
    title: 'BM with Ad Account',
    price: '$449',
    description: 'Complete package with verified BM and pre-heated ad account for immediate campaigns.',
    features: [
      'Verified Business Manager',
      'Pre-heated ad account',
      '$5000 spending limit',
      'Payment method ready',
      '60-day warranty'
    ],
    image: '🎯',
    category: 'Business Manager'
  },
  'waba-verification-service': {
    id: 'waba-verification-service',
    title: 'WABA Verification Service',
    price: '$149',
    description: 'Professional WABA verification service to get your business officially verified.',
    features: [
      'Official verification',
      'Business documentation help',
      'Fast processing',
      'Success guarantee',
      'Documentation support'
    ],
    image: '✅',
    category: 'Verification'
  },
  'facebook-page-with-bm': {
    id: 'facebook-page-with-bm',
    title: 'Facebook Page with BM',
    price: '$179',
    description: 'Aged Facebook page linked with verified Business Manager for instant authority.',
    features: [
      'Aged Facebook page (2+ years)',
      'Linked to verified BM',
      'Clean history',
      'Ready for posting',
      '30-day warranty'
    ],
    image: '📘',
    category: 'Facebook Page'
  },
  'instagram-business-account': {
    id: 'instagram-business-account',
    title: 'Instagram Business Account',
    price: '$129',
    description: 'Verified Instagram business account connected to Facebook BM for cross-platform marketing.',
    features: [
      'Business account setup',
      'Connected to FB BM',
      'Shopping feature enabled',
      'Analytics access',
      'Growth tips included'
    ],
    image: '📸',
    category: 'Instagram'
  }
};

// Load product details on product-detail.html
if (window.location.pathname.includes('product-detail.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (productId && products[productId]) {
    const product = products[productId];
    
    const titleEl = document.getElementById('productTitle');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDescription');
    const imageEl = document.getElementById('productImage');
    const featuresEl = document.getElementById('productFeatures');
    
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) priceEl.textContent = product.price;
    if (descEl) descEl.textContent = product.description;
    if (imageEl) imageEl.textContent = product.image;
    
    if (featuresEl) {
      featuresEl.innerHTML = product.features.map(feature => 
        `<li><span>✓</span> ${feature}</li>`
      ).join('');
    }
    
    // Update WhatsApp button
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
      const message = encodeURIComponent(`Hi, I'm interested in buying ${product.title} (${product.price})`);
      whatsappBtn.href = `https://wa.me/1234567890?message=${message}`;
    }
    
    // Update Telegram button
    const telegramBtn = document.getElementById('telegramBtn');
    if (telegramBtn) {
      telegramBtn.onclick = function() {
        window.open(`https://t.me/yourusername?start=${productId}`, '_blank');
      };
    }
  }
}
