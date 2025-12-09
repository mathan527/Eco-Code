// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Setup navigation
    setupNavigation();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Check API health
    checkAPIHealth();
    
    // Load dashboard if on dashboard section
    if (window.location.hash === '#dashboard') {
        loadDashboard();
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            e.target.classList.add('active');
        });
    });
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function handleHashChange() {
    const hash = window.location.hash;
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
    
    // Load dashboard if navigating to it
    if (hash === '#dashboard') {
        loadDashboard();
    }
}

async function checkAPIHealth() {
    try {
        const health = await api.healthCheck();
        console.log('API Health:', health);
    } catch (error) {
        console.warn('API is not available:', error.message);
        showNotification('Backend API is not available. Some features may not work.', 'warning');
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.location.hash = `#${sectionId}`;
    }
}

// Utility Functions
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    }[type] || 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification styles
const notificationStyles = `
<style>
.notification-container {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
}

.notification {
    background: white;
    padding: 1rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: opacity 0.3s ease;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification i:first-child {
    font-size: 1.5rem;
}

.notification-success {
    border-left: 4px solid var(--success-color);
}

.notification-success i:first-child {
    color: var(--success-color);
}

.notification-error {
    border-left: 4px solid var(--danger-color);
}

.notification-error i:first-child {
    color: var(--danger-color);
}

.notification-warning {
    border-left: 4px solid var(--warning-color);
}

.notification-warning i:first-child {
    color: var(--warning-color);
}

.notification-info {
    border-left: 4px solid var(--secondary-color);
}

.notification-info i:first-child {
    color: var(--secondary-color);
}

.notification span {
    flex: 1;
    font-size: 0.875rem;
}

.notification button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-400);
    font-size: 1rem;
    padding: 0.25rem;
    transition: color var(--transition-base);
}

.notification button:hover {
    color: var(--gray-600);
}

@media (max-width: 768px) {
    .notification-container {
        left: 20px;
        right: 20px;
        max-width: none;
    }
}
</style>
`;

if (!document.getElementById('notification-styles')) {
    const styleTag = document.createElement('div');
    styleTag.id = 'notification-styles';
    styleTag.innerHTML = notificationStyles;
    document.head.appendChild(styleTag);
}

// Export functions for global use
window.scrollToSection = scrollToSection;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showNotification = showNotification;
