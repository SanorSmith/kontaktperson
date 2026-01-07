// Kontaktperson Platform JavaScript
class KontaktpersonPlatform {
    constructor() {
        this.currentPage = 'page-landing';
        this.currentStep = 1;
        this.init();
    }

    init() {
        // Initialize the platform
        this.showPage('page-landing');
        this.setupEventListeners();
        this.setupFormHandlers();
        this.setupAnimations();
    }

    // Page Navigation
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.app-page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show requested page
        const target = document.getElementById(pageId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('fade-in');
            window.scrollTo(0, 0);
            this.currentPage = pageId;
        }
        
        // Update step indicator if needed
        if (pageId === 'page-register') {
            this.showStep(1);
        }
    }

    // Registration Step Navigation
    showStep(stepNum) {
        this.currentStep = stepNum;
        
        // Hide all step contents
        document.querySelectorAll('.reg-step-content').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Show current step content
        const currentContent = document.getElementById(`step-content-${stepNum}`);
        if (currentContent) {
            currentContent.classList.remove('hidden');
            currentContent.classList.add('fade-in');
        }
        
        // Update step indicators
        for (let i = 1; i <= 5; i++) {
            const circle = document.getElementById(`step-circle-${i}`);
            const line = document.getElementById(`step-line-${i}`);
            
            if (circle) {
                // Reset classes
                circle.className = "step-circle";
                
                if (i < stepNum) {
                    circle.classList.add('completed');
                    circle.innerHTML = '<iconify-icon icon="lucide:check" width="16"></iconify-icon>';
                } else if (i === stepNum) {
                    circle.classList.add('active');
                    circle.innerText = i;
                } else {
                    circle.classList.add('pending');
                    circle.innerText = i;
                }
            }
            
            if (line) {
                if (i < stepNum) {
                    line.classList.add('active');
                } else {
                    line.classList.remove('active');
                }
            }
        }
    }

    // Accordion Toggle
    toggleAccordion(id) {
        const content = document.getElementById(id);
        const icon = document.getElementById(id + '-icon');
        
        if (content && icon) {
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.setAttribute('icon', 'lucide:minus');
            } else {
                content.classList.add('hidden');
                icon.setAttribute('icon', 'lucide:plus');
            }
        }
    }

    // Form Validation
    validateStep(stepNum) {
        let isValid = true;
        const stepContent = document.getElementById(`step-content-${stepNum}`);
        
        if (!stepContent) return false;
        
        // Get all required inputs in current step
        const requiredInputs = stepContent.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'Detta fält är obligatoriskt');
                isValid = false;
            } else {
                this.clearInputError(input);
            }
        });
        
        // Email validation
        const emailInputs = stepContent.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            if (input.value && !this.isValidEmail(input.value)) {
                this.showInputError(input, 'Ange en giltig e-postadress');
                isValid = false;
            }
        });
        
        // Phone validation
        const phoneInputs = stepContent.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            if (input.value && !this.isValidPhone(input.value)) {
                this.showInputError(input, 'Ange ett giltigt telefonnummer');
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Input Validation Helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
    }

    showInputError(input, message) {
        input.classList.add('border-red-500');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-xs mt-1';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    clearInputError(input) {
        input.classList.remove('border-red-500');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Form Handlers
    setupFormHandlers() {
        // Range slider value display
        const rangeSlider = document.querySelector('input[type="range"]');
        if (rangeSlider) {
            const valueDisplay = rangeSlider.previousElementSibling;
            if (valueDisplay) {
                rangeSlider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    valueDisplay.innerHTML = `Timmar per vecka: <span class="text-[#006B7D] font-bold ml-1">${value} tim</span>`;
                });
            }
        }

        // Password visibility toggle
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            const toggleIcon = input.nextElementSibling;
            if (toggleIcon && toggleIcon.tagName === 'ICONIFY-ICON') {
                toggleIcon.addEventListener('click', () => {
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                    toggleIcon.setAttribute('icon', type === 'password' ? 'lucide:eye' : 'lucide:eye-off');
                });
            }
        });

        // Form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    handleFormSubmit(form) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Skickar...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                this.showSuccessMessage('Formuläret har skickats!');
            }, 1500);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation buttons
        document.addEventListener('click', (e) => {
            if (e.target.onclick) {
                // Handle inline onclick events
                return;
            }
            
            // Handle navigation
            if (e.target.matches('[data-navigate]')) {
                const page = e.target.getAttribute('data-navigate');
                this.showPage(page);
            }
            
            // Handle step navigation
            if (e.target.matches('[data-step]')) {
                const step = parseInt(e.target.getAttribute('data-step'));
                if (this.validateStep(this.currentStep)) {
                    this.showStep(step);
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key to go back
            if (e.key === 'Escape') {
                this.goBack();
            }
            
            // Arrow keys for step navigation
            if (this.currentPage === 'page-register') {
                if (e.key === 'ArrowRight' && this.currentStep < 5) {
                    if (this.validateStep(this.currentStep)) {
                        this.showStep(this.currentStep + 1);
                    }
                } else if (e.key === 'ArrowLeft' && this.currentStep > 1) {
                    this.showStep(this.currentStep - 1);
                }
            }
        });

        // Touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        this.touchStartX = touchStartX;
        this.touchEndX = touchEndX;
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && this.currentStep < 5) {
                // Swipe left - next step
                if (this.validateStep(this.currentStep)) {
                    this.showStep(this.currentStep + 1);
                }
            } else if (diff < 0 && this.currentStep > 1) {
                // Swipe right - previous step
                this.showStep(this.currentStep - 1);
            }
        }
    }

    // Navigation helpers
    goBack() {
        if (this.currentPage === 'page-register' && this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        } else if (this.currentPage !== 'page-landing') {
            this.showPage('page-landing');
        }
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Messages and Notifications
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.message-toast');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg fade-in ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Search functionality
    setupSearch() {
        const searchInput = document.querySelector('input[placeholder*="Sök"]');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value;
                
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            });
        }
    }

    performSearch(query) {
        // Simulate search functionality
        console.log('Searching for:', query);
        
        // Show loading state
        const resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="text-center py-8">Söker...</div>';
        }
        
        // Simulate API call
        setTimeout(() => {
            this.displaySearchResults([]);
        }, 500);
    }

    displaySearchResults(results) {
        const resultsContainer = document.querySelector('.results-container');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <iconify-icon icon="lucide:search" width="48" class="mx-auto mb-4"></iconify-icon>
                    <p>Inga resultat hittades</p>
                </div>
            `;
        } else {
            // Display results
            resultsContainer.innerHTML = results.map(result => `
                <div class="result-card bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                    <h3 class="font-semibold">${result.name}</h3>
                    <p class="text-sm text-gray-500">${result.location}</p>
                </div>
            `).join('');
        }
    }

    // Utility functions
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Global functions for backward compatibility with inline onclick handlers
function showPage(pageId) {
    if (window.platform) {
        window.platform.showPage(pageId);
    }
}

function showStep(stepNum) {
    if (window.platform) {
        window.platform.showStep(stepNum);
    }
}

function toggleAccordion(id) {
    if (window.platform) {
        window.platform.toggleAccordion(id);
    }
}

// Initialize platform when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new KontaktpersonPlatform();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KontaktpersonPlatform;
}
