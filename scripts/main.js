// Main JavaScript for AYUSHCare

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');

            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.nav-content')) {
                navLinks.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Progress Bar Animation on Scroll
    const progressBars = document.querySelectorAll('.progress-fill');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const progressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width || '0%';
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Chart Bar Animation
    const chartBars = document.querySelectorAll('.chart-bar');

    const chartObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const height = bar.style.height || '0%';
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = height;
                }, 100);
            }
        });
    }, observerOptions);

    chartBars.forEach(bar => {
        chartObserver.observe(bar);
    });

    // Card Hover Effects
    const featureCards = document.querySelectorAll('.feature-card, .benefit-card, .speciality-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Initialize any lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-link');

    navLinksAll.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Page Transition / Loader
    const loaderHTML = `
        <div class="page-loader" id="pageLoader">
            <div class="loader-spinner"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
    const pageLoader = document.getElementById('pageLoader');

    // Live Chat Widget
    const chatHTML = `
        <div class="live-chat-widget">
            <div class="chat-bubble">👋 Need help? Chat with us!</div>
            <button class="chat-button" aria-label="Open Live Chat">
                <span class="chat-icon">💬</span>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // Handle internal links
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        // Check if it's an internal link and not a hash link or modifier key click
        if (href &&
            !href.startsWith('#') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            !href.startsWith('javascript:') &&
            !link.target &&
            !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {

            e.preventDefault();

            // Show loader
            if (pageLoader) {
                pageLoader.classList.add('visible');
            }

            // Small delay for visual feedback then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 200); // Reduced duration
        }
    });

    // Console welcome message
    console.log('%c Welcome to AYUSHCare ', 'background: #10b981; color: white; font-size: 16px; padding: 10px;');
    console.log('%c Professional AYUSH Practice Management Platform ', 'color: #6b7280; font-size: 12px;');
});
