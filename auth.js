// Authentication Module using Supabase
class AuthService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.initSupabase();
    }

    initSupabase() {
        try {
            if (typeof supabase !== 'undefined' && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
                this.supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
                this.checkSession();
            }
        } catch (error) {
            console.error('Supabase initialization error:', error);
        }
    }

    async checkSession() {
        if (!this.supabase) return;

        try {
            const { data: { session } } = await this.supabase.auth.getSession();
            if (session) {
                this.currentUser = session.user;
                this.onAuthStateChange();
            }

            // Listen for auth changes
            this.supabase.auth.onAuthStateChange((event, session) => {
                if (session) {
                    this.currentUser = session.user;
                } else {
                    this.currentUser = null;
                }
                this.onAuthStateChange();
            });
        } catch (error) {
            console.error('Session check error:', error);
        }
    }

    async signUp(email, password, fullName) {
        if (!this.supabase) {
            throw new Error('Authentication not configured');
        }

        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) throw error;

            // Create user profile
            if (data.user) {
                await this.supabase.from('users').insert([
                    {
                        id: data.user.id,
                        email: data.user.email,
                        full_name: fullName
                    }
                ]);
            }

            return data;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    async signIn(email, password) {
        if (!this.supabase) {
            throw new Error('Authentication not configured');
        }

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    async signOut() {
        if (!this.supabase) return;

        try {
            await this.supabase.auth.signOut();
            this.currentUser = null;
            this.onAuthStateChange();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }

    async resetPassword(email) {
        if (!this.supabase) {
            throw new Error('Authentication not configured');
        }

        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUserId() {
        return this.currentUser?.id || null;
    }

    getUserEmail() {
        return this.currentUser?.email || null;
    }

    onAuthStateChange() {
        // Update UI based on auth state
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            if (this.isAuthenticated()) {
                loginBtn.textContent = 'Logout';
                loginBtn.onclick = () => this.signOut();
            } else {
                loginBtn.textContent = 'Login';
                loginBtn.onclick = () => showLogin();
            }
        }

        // Update dashboard
        if (this.isAuthenticated() && window.location.hash === '#dashboard') {
            loadDashboard();
        }
    }
}

// Create global instance
const auth = new AuthService();

// Login Modal Functions
function showLogin() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Login to EcoCode</h2>
                <button class="btn btn-small btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="loginEmail" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" class="form-input" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-large" style="width: 100%;">
                        Login
                    </button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Don't have an account? <a href="#" onclick="showSignup()">Sign up</a>
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Stop event propagation from modal to prevent Monaco editor keyboard errors
    modal.addEventListener('keydown', (e) => e.stopPropagation(), true);
    modal.addEventListener('keyup', (e) => e.stopPropagation(), true);
    modal.addEventListener('keypress', (e) => e.stopPropagation(), true);
}

function showSignup() {
    closeModal();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Sign Up for EcoCode</h2>
                <button class="btn btn-small btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="signupForm" onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="signupName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="signupEmail" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="signupPassword" class="form-input" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary btn-large" style="width: 100%;">
                        Sign Up
                    </button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Already have an account? <a href="#" onclick="showLogin()">Login</a>
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Stop event propagation from modal to prevent Monaco editor keyboard errors
    modal.addEventListener('keydown', (e) => e.stopPropagation(), true);
    modal.addEventListener('keyup', (e) => e.stopPropagation(), true);
    modal.addEventListener('keypress', (e) => e.stopPropagation(), true);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        showLoading('Logging in...');
        await auth.signIn(email, password);
        closeModal();
        hideLoading();
        showNotification('Login successful!', 'success');
    } catch (error) {
        hideLoading();
        showNotification(error.message, 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        showLoading('Creating account...');
        await auth.signUp(email, password, name);
        closeModal();
        hideLoading();
        showNotification('Account created! Please check your email to verify.', 'success');
    } catch (error) {
        hideLoading();
        showNotification(error.message, 'error');
    }
}

// Add modal styles
const modalStyles = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal {
    background: white;
    border-radius: 1rem;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}
</style>
`;

if (!document.getElementById('modal-styles')) {
    const styleTag = document.createElement('div');
    styleTag.id = 'modal-styles';
    styleTag.innerHTML = modalStyles;
    document.head.appendChild(styleTag);
}
