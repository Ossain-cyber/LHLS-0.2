// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing scripts');
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        console.log('Menu elements found');
        
        menuToggle.addEventListener('click', function() {
            console.log('Menu toggle clicked');
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link, .nav-btn');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Nav link clicked, closing menu');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.log('Menu elements NOT found:', { menuToggle, navMenu });
    }
    
    // ===== IMAGE FALLBACK SYSTEM =====
    function initImageFallback() {
        const images = document.querySelectorAll('img[data-placeholder]');
        console.log('Found images with placeholders:', images.length);
        
        images.forEach(img => {
            // Check if image loads successfully
            const originalSrc = img.src;
            
            // Create a test image to check if original loads
            const testImage = new Image();
            
            testImage.onload = function() {
                // Original image loaded successfully
                img.classList.remove('img-loading');
                console.log('Image loaded successfully:', originalSrc);
            };
            
            testImage.onerror = function() {
                // Original image failed, use placeholder
                const placeholder = img.getAttribute('data-placeholder');
                if (placeholder) {
                    img.src = placeholder;
                    console.log('Using placeholder for:', originalSrc);
                }
                img.classList.remove('img-loading');
            };
            
            // Start loading test
            testImage.src = originalSrc;
            
            // Also handle direct error on the element
            img.onerror = function() {
                const placeholder = this.getAttribute('data-placeholder');
                if (placeholder && this.src !== placeholder) {
                    this.src = placeholder;
                    console.log('Direct error - using placeholder');
                }
                this.classList.remove('img-loading');
            };
        });
    }
    
    // Initialize image fallback
    initImageFallback();
    
    // ===== HERO SLIDER =====
    function initHeroSlider() {
        const slides = document.querySelectorAll('.slide');
        console.log('Slides found:', slides.length);
        
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Auto slide every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    initHeroSlider();
    
    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .section-title, .section-subtitle');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    initScrollAnimations();
    
    // ===== GLASS EFFECT ON SCROLL =====
    function initGlassEffect() {
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.backdropFilter = 'blur(15px)';
                } else {
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                }
            });
        }
    }
    
    initGlassEffect();
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== CURRENT YEAR IN FOOTER =====
    const yearSpan = document.querySelector('#current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // ===== FORM VALIDATION FOR CONTACT PAGE =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const phone = this.querySelector('#phone').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            if (!name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Here you would normally send the form data to a server
            // For now, we'll show a success message
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize window resize
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// Debug helper
console.log('Script.js loaded successfully');