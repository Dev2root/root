// Portfolio Website Main JavaScript

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize navbar scroll behavior
    initNavbarScroll();
    
    // Auto-hide flash messages after 5 seconds
    initFlashMessages();
    
    // Initialize portfolio item hover effects
    initPortfolioHover();
});

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Calculate offset (accounting for fixed navbar)
            const navbarHeight = document.getElementById('main-nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - navbarHeight;
            
            // Smooth scroll to target
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Navbar scroll behavior (transparent at top, solid when scrolled)
function initNavbarScroll() {
    const navbar = document.getElementById('main-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Auto-hide flash messages
function initFlashMessages() {
    const flashMessages = document.querySelectorAll('.alert');
    
    flashMessages.forEach(message => {
        setTimeout(() => {
            // Use Bootstrap's built-in close method
            const closeButton = new bootstrap.Alert(message);
            closeButton.close();
        }, 5000);
    });
}

// Portfolio item hover effects
function initPortfolioHover() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add subtle animation or effect when hovering
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            // Reset to original state
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}
