// Authentication and Session Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.idleTimer = null;
        this.init();
    }

    init() {
        // Check for existing session on page load
        this.checkSession();
        // Setup idle timer
        this.setupIdleTimer();
        // Setup activity listeners
        this.setupActivityListeners();
    }

    // Session Management
    checkSession() {
        const session = this.getSession();
        if (session) {
            const now = Date.now();
            const sessionAge = now - session.loginTime;
            const lastActivity = now - session.lastActivity;

            // Check if session expired
            if (sessionAge > 24 * 60 * 60 * 1000) { // 24 hours max
                this.logout();
                return false;
            }

            // Check if idle too long
            if (lastActivity > this.sessionTimeout) {
                this.logout();
                alert('Din session har löpt ut på grund av inaktivitet. Logga in igen.');
                return false;
            }

            // Session is valid
            this.currentUser = session.user;
            this.updateLastActivity();
            this.updateUI();
            return true;
        }
        return false;
    }

    login(email, password, role = 'user') {
        // Mock authentication - replace with real API call
        // For demo purposes, accept any email/password
        
        const user = {
            id: this.generateId(),
            email: email,
            role: role,
            name: this.extractNameFromEmail(email)
        };

        const session = {
            user: user,
            loginTime: Date.now(),
            lastActivity: Date.now()
        };

        // Save session to localStorage
        localStorage.setItem('kontaktperson_session', JSON.stringify(session));
        this.currentUser = user;
        
        // Update UI
        this.updateUI();
        
        // Reset idle timer
        this.resetIdleTimer();

        return { success: true, user: user };
    }

    logout() {
        // Clear session
        localStorage.removeItem('kontaktperson_session');
        this.currentUser = null;
        
        // Clear idle timer
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }
        
        // Update UI
        this.updateUI();
        
        // Redirect to landing page
        if (typeof platform !== 'undefined') {
            platform.showPage('page-landing');
        }
    }

    getSession() {
        const sessionData = localStorage.getItem('kontaktperson_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    updateLastActivity() {
        const session = this.getSession();
        if (session) {
            session.lastActivity = Date.now();
            localStorage.setItem('kontaktperson_session', JSON.stringify(session));
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Idle Timer
    setupIdleTimer() {
        this.resetIdleTimer();
    }

    resetIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
        }

        if (this.isLoggedIn()) {
            this.idleTimer = setTimeout(() => {
                this.logout();
                alert('Du har blivit utloggad på grund av inaktivitet.');
            }, this.sessionTimeout);
        }
    }

    setupActivityListeners() {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                if (this.isLoggedIn()) {
                    this.updateLastActivity();
                    this.resetIdleTimer();
                }
            }, true);
        });
    }

    // UI Updates
    updateUI() {
        // Update login/logout buttons
        const loginButtons = document.querySelectorAll('.login-button');
        const logoutButtons = document.querySelectorAll('.logout-button');
        const userNameDisplays = document.querySelectorAll('.user-name-display');

        if (this.isLoggedIn()) {
            // Hide login buttons
            loginButtons.forEach(btn => btn.classList.add('hidden'));
            
            // Show logout buttons
            logoutButtons.forEach(btn => btn.classList.remove('hidden'));
            
            // Update user name displays
            userNameDisplays.forEach(display => {
                display.textContent = this.currentUser.name || this.currentUser.email;
                display.classList.remove('hidden');
            });

            // Show/hide admin panel based on role
            this.updateAdminAccess();
        } else {
            // Show login buttons
            loginButtons.forEach(btn => btn.classList.remove('hidden'));
            
            // Hide logout buttons
            logoutButtons.forEach(btn => btn.classList.add('hidden'));
            
            // Hide user name displays
            userNameDisplays.forEach(display => {
                display.classList.add('hidden');
            });

            // Hide admin panel
            this.updateAdminAccess();
        }
    }

    updateAdminAccess() {
        const adminMenuItems = document.querySelectorAll('.admin-only');
        const adminPages = document.querySelectorAll('.admin-page');

        if (this.isAdmin()) {
            // Show admin menu items
            adminMenuItems.forEach(item => item.classList.remove('hidden'));
            
            // Enable admin pages
            adminPages.forEach(page => page.dataset.accessible = 'true');
        } else {
            // Hide admin menu items
            adminMenuItems.forEach(item => item.classList.add('hidden'));
            
            // Disable admin pages
            adminPages.forEach(page => page.dataset.accessible = 'false');
            
            // If currently on admin page, redirect
            if (typeof platform !== 'undefined' && platform.currentPage === 'page-admin') {
                platform.showPage('page-landing');
                alert('Du har inte behörighet att komma åt denna sida.');
            }
        }
    }

    // Helper Methods
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    extractNameFromEmail(email) {
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._-]/g, ' ');
    }

    // Check if user can access a page
    canAccessPage(pageId) {
        // Public pages
        const publicPages = ['page-landing', 'page-register', 'page-login', 'page-faq'];
        if (publicPages.includes(pageId)) {
            return true;
        }

        // Admin-only pages
        const adminPages = ['page-admin'];
        if (adminPages.includes(pageId)) {
            return this.isAdmin();
        }

        // Authenticated pages
        return this.isLoggedIn();
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Global login function
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Determine role based on email domain
    let role = 'user';
    if (email.endsWith('@admin.se') || email.endsWith('@kontaktperson.se')) {
        role = 'admin';
    } else if (email.endsWith('@kommun.se') || email.endsWith('@stad.se')) {
        role = 'social_worker';
    }
    
    const result = authManager.login(email, password, role);
    
    if (result.success) {
        // Redirect based on role
        if (role === 'admin') {
            platform.showPage('page-admin');
        } else if (role === 'social_worker') {
            platform.showPage('page-dashboard');
        } else {
            platform.showPage('page-landing');
        }
        
        // Show success message
        showNotification('Inloggning lyckades!', 'success');
    } else {
        showNotification('Inloggning misslyckades. Kontrollera dina uppgifter.', 'error');
    }
}

// Global logout function
function handleLogout() {
    if (confirm('Är du säker på att du vill logga ut?')) {
        authManager.logout();
        showNotification('Du har loggats ut.', 'info');
    }
}

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white animate-fade-in-up ${
        type === 'success' ? 'bg-[#27AE60]' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-[#003D5C]'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
