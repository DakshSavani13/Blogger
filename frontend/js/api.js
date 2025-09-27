// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Helper Functions
class API {
    static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            showLoading();
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        } finally {
            hideLoading();
        }
    }

    static async get(endpoint) {
        return this.request(endpoint);
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    static async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
}

// Auth API
class AuthAPI {
    static async login(email, password) {
        return API.post('/auth/login', { email, password });
    }

    static async register(username, email, password, role = 'user') {
        return API.post('/auth/register', { username, email, password, role });
    }

    static async getCurrentUser() {
        return API.get('/auth/me');
    }
}

// Posts API
class PostsAPI {
    static async getPosts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return API.get(`/posts${queryString ? `?${queryString}` : ''}`);
    }

    static async getPost(slug) {
        return API.get(`/posts/${slug}`);
    }

    static async createPost(postData) {
        return API.post('/posts', postData);
    }

    static async updatePost(id, postData) {
        return API.put(`/posts/${id}`, postData);
    }

    static async deletePost(id) {
        return API.delete(`/posts/${id}`);
    }

    static async getPostsByCategory(categorySlug, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return API.get(`/posts/category/${categorySlug}${queryString ? `?${queryString}` : ''}`);
    }
}

// Categories API
class CategoriesAPI {
    static async getCategories() {
        return API.get('/categories');
    }

    static async getCategory(slug) {
        return API.get(`/categories/${slug}`);
    }

    static async createCategory(categoryData) {
        return API.post('/categories', categoryData);
    }

    static async updateCategory(id, categoryData) {
        return API.put(`/categories/${id}`, categoryData);
    }

    static async deleteCategory(id) {
        return API.delete(`/categories/${id}`);
    }
}

// Comments API
class CommentsAPI {
    static async getComments(postId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return API.get(`/comments/post/${postId}${queryString ? `?${queryString}` : ''}`);
    }

    static async createComment(commentData) {
        return API.post('/comments', commentData);
    }

    static async updateComment(id, commentData) {
        return API.put(`/comments/${id}`, commentData);
    }

    static async deleteComment(id) {
        return API.delete(`/comments/${id}`);
    }

    static async getAdminComments(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return API.get(`/comments/admin${queryString ? `?${queryString}` : ''}`);
    }

    static async updateCommentStatus(id, status) {
        return API.patch(`/comments/${id}/status`, { status });
    }
}

// Utility Functions
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
