// Authentication Management
class AuthManager {
    static currentUser = null;

    static init() {
        this.checkAuthStatus();
        this.updateUI();
    }

    static async checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await AuthAPI.getCurrentUser();
                this.currentUser = response.user;
                return true;
            } catch (error) {
                localStorage.removeItem('token');
                this.currentUser = null;
                return false;
            }
        }
        return false;
    }

    static updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const adminMenu = document.getElementById('admin-menu');
        const usernameDisplay = document.getElementById('username-display');

        if (this.currentUser) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            usernameDisplay.textContent = this.currentUser.username;

            if (this.currentUser.role === 'admin') {
                adminMenu.style.display = 'block';
            } else {
                adminMenu.style.display = 'none';
            }
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    static isAuthenticated() {
        return this.currentUser !== null;
    }

    static isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    static setUser(user, token) {
        this.currentUser = user;
        localStorage.setItem('token', token);
        this.updateUI();
    }

    static logout() {
        this.currentUser = null;
        localStorage.removeItem('token');
        this.updateUI();
        showHome();
        showToast('Logged out successfully');
    }
}

// Auth Modal Functions
function showLogin() {
    document.getElementById('auth-modal').style.display = 'block';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('auth-modal').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function closeModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

// Login Function
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await AuthAPI.login(email, password);
        AuthManager.setUser(response.user, response.token);
        closeModal();
        showToast('Login successful!');
        
        // Clear form
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Register Function
async function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
        const response = await AuthAPI.register(username, email, password, role);
        AuthManager.setUser(response.user, response.token);
        closeModal();
        showToast('Registration successful!');
        
        // Clear form
        document.getElementById('register-username').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-role').value = 'user';
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Logout Function
function logout() {
    AuthManager.logout();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target === modal) {
        closeModal();
    }
}
