// Main Application Controller
class App {
    static async init() {
        console.log('Initializing Blogger App...');
        
        // Initialize authentication
        await AuthManager.init();
        
        // Initialize posts manager
        await PostsManager.init();
        
        // Show home section by default
        showHome();
        
        console.log('Blogger App initialized successfully!');
    }
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
}

function showHome() {
    showSection('home-section');
    PostsManager.loadPosts();
}

function showCategories() {
    showSection('categories-section');
    loadCategoriesPage();
}

async function showAdminDashboard() {
    if (!AuthManager.isAdmin()) {
        showToast('Access denied. Admin rights required.', 'error');
        return;
    }
    
    showSection('admin-section');
    await AdminManager.init();
}

// Categories Page Functions
async function loadCategoriesPage() {
    try {
        const categories = await CategoriesAPI.getCategories();
        renderCategoriesPage(categories);
    } catch (error) {
        console.error('Error loading categories page:', error);
        showToast('Error loading categories', 'error');
    }
}

function renderCategoriesPage(categories) {
    const container = document.getElementById('categories-container');
    
    if (categories.length === 0) {
        container.innerHTML = '<p>No categories found.</p>';
        return;
    }

    container.innerHTML = categories.map(category => `
        <div class="category-card" onclick="showCategoryPosts('${category.slug}')">
            <h3>${category.name}</h3>
            <p>${category.description || 'No description available'}</p>
        </div>
    `).join('');
}

async function showCategoryPosts(categorySlug) {
    try {
        // Set the category filter and reload posts
        document.getElementById('category-filter').value = categorySlug;
        PostsManager.currentCategory = categorySlug;
        PostsManager.currentPage = 1;
        await PostsManager.loadPosts();
        showHome();
    } catch (error) {
        console.error('Error loading category posts:', error);
        showToast('Error loading posts', 'error');
    }
}

// Utility Functions
function goBack() {
    showHome();
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred', 'error');
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Add some additional CSS for better UX
const additionalStyles = `
    .btn-link {
        background: none;
        border: none;
        color: #3b82f6;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
        margin: 0 0.25rem;
    }

    .btn-link:hover {
        text-decoration: underline;
    }

    .btn-link.text-danger {
        color: #ef4444;
    }

    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }

    .no-posts, .no-comments {
        text-align: center;
        color: #6b7280;
        padding: 2rem;
        font-style: italic;
    }

    .post-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .comment-actions {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
    }

    .reply-form {
        margin-top: 1rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 6px;
    }

    .reply-form textarea {
        width: 100%;
        min-height: 80px;
        margin-bottom: 0.5rem;
    }

    .reply-actions {
        display: flex;
        gap: 0.5rem;
    }

    .edit-textarea {
        width: 100%;
        min-height: 80px;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .edit-actions {
        display: flex;
        gap: 0.5rem;
    }

    .reply {
        margin-left: 2rem;
        margin-top: 1rem;
        border-left: 3px solid #e5e7eb;
        padding-left: 1rem;
    }

    @media (max-width: 768px) {
        .reply {
            margin-left: 1rem;
        }
        
        .comment-actions {
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .reply-actions, .edit-actions {
            flex-direction: column;
        }
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions to global scope for HTML onclick handlers
window.showHome = showHome;
window.showCategories = showCategories;
window.showAdminDashboard = showAdminDashboard;
window.showCreatePost = showCreatePost;
window.showManageCategories = () => {
    showAdminDashboard();
    setTimeout(() => showAdminTab('categories'), 100);
};
window.showLogin = showLogin;
window.showRegister = showRegister;
window.closeModal = closeModal;
window.login = login;
window.register = register;
window.logout = logout;
window.showPostDetail = showPostDetail;
window.submitComment = submitComment;
window.submitReply = submitReply;
window.showReplyForm = showReplyForm;
window.cancelReply = cancelReply;
window.editComment = editComment;
window.saveComment = saveComment;
window.cancelEdit = cancelEdit;
window.deleteComment = deleteComment;
window.showAdminTab = showAdminTab;
window.editPost = editPost;
window.savePost = savePost;
window.deletePost = deletePost;
window.showCreateCategory = showCreateCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.updateCommentStatus = updateCommentStatus;
window.deleteCommentAdmin = deleteCommentAdmin;
window.searchPosts = searchPosts;
window.filterByCategory = filterByCategory;
