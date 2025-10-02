// Admin Management
class AdminManager {
    static currentTab = 'posts';
    static adminPosts = [];
    static adminCategories = [];
    static adminComments = [];

    static async init() {
        if (!AuthManager.isAdmin()) {
            showToast('Access denied. Admin rights required.', 'error');
            showHome();
            return;
        }
        
        await this.loadAdminData();
        // Ensure categories are loaded for post forms
        await PostsManager.loadCategories();
    }

    static async loadAdminData() {
        try {
            await Promise.all([
                this.loadAdminPosts(),
                this.loadAdminCategories(),
                this.loadAdminComments()
            ]);
        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    static async loadAdminPosts() {
        try {
            console.log('Loading admin posts...');
            const response = await PostsAPI.getPosts({ status: 'all', limit: 50 });
            console.log('Admin posts response:', response);
            this.adminPosts = response.posts;
            console.log('Admin posts loaded:', this.adminPosts.length);
            this.renderAdminPosts();
        } catch (error) {
            console.error('Error loading admin posts:', error);
        }
    }

    static async loadAdminCategories() {
        try {
            this.adminCategories = await CategoriesAPI.getCategories();
            this.renderAdminCategories();
        } catch (error) {
            console.error('Error loading admin categories:', error);
        }
    }

    static async loadAdminComments() {
        try {
            const response = await CommentsAPI.getAdminComments({ limit: 50 });
            this.adminComments = response.comments;
            this.renderAdminComments();
        } catch (error) {
            console.error('Error loading admin comments:', error);
        }
    }

    static renderAdminPosts() {
        const container = document.getElementById('admin-posts-list');
        
        if (this.adminPosts.length === 0) {
            container.innerHTML = '<p>No posts found.</p>';
            return;
        }

        container.innerHTML = this.adminPosts.map(post => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${post.title}</h4>
                    <p>Category: ${post.category.name} | Status: ${post.status} | Views: ${post.views}</p>
                    <p>Created: ${formatDate(post.createdAt)}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-sm btn-outline" onclick="editPost('${post._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost('${post._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    static renderAdminCategories() {
        const container = document.getElementById('admin-categories-list');
        
        if (this.adminCategories.length === 0) {
            container.innerHTML = '<p>No categories found.</p>';
            return;
        }

        container.innerHTML = this.adminCategories.map(category => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>${category.name}</h4>
                    <p>${category.description || 'No description'}</p>
                    <p>Slug: ${category.slug}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-sm btn-outline" onclick="editCategory('${category._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    static renderAdminComments() {
        const container = document.getElementById('admin-comments-list');
        
        if (this.adminComments.length === 0) {
            container.innerHTML = '<p>No comments found.</p>';
            return;
        }

        container.innerHTML = this.adminComments.map(comment => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h4>Comment by ${comment.author.username}</h4>
                    <p>${truncateText(comment.content, 100)}</p>
                    <p>Post: ${comment.post.title} | Status: ${comment.status}</p>
                    <p>Created: ${formatDate(comment.createdAt)}</p>
                </div>
                <div class="admin-item-actions">
                    ${comment.status !== 'approved' ? `
                        <button class="btn btn-sm btn-primary" onclick="updateCommentStatus('${comment._id}', 'approved')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                    ` : ''}
                    ${comment.status !== 'rejected' ? `
                        <button class="btn btn-sm btn-warning" onclick="updateCommentStatus('${comment._id}', 'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteCommentAdmin('${comment._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Admin Tab Functions
function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`admin-${tabName}`).classList.add('active');

    AdminManager.currentTab = tabName;
}

// Post Management Functions
async function showCreatePost() {
    document.getElementById('post-form-title').textContent = 'Create New Post';
    document.getElementById('post-id').value = '';
    document.getElementById('post-form').reset();
    
    // Ensure categories are loaded in the form
    await PostsManager.loadCategories();
    
    showSection('post-form-section');
}

async function editPost(postId) {
    try {
        const post = AdminManager.adminPosts ? 
            AdminManager.adminPosts.find(p => p._id === postId) :
            await PostsAPI.getPost(postId);
        
        if (!post) {
            showToast('Post not found', 'error');
            return;
        }

        // Ensure categories are loaded in the form before populating
        await PostsManager.loadCategories();

        document.getElementById('post-form-title').textContent = 'Edit Post';
        document.getElementById('post-id').value = post._id;
        document.getElementById('post-title').value = post.title;
        
        // Handle category selection properly
        const categoryId = post.category._id || post.category;
        document.getElementById('post-category').value = categoryId;
        
        document.getElementById('post-excerpt').value = post.excerpt || '';
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-tags').value = post.tags ? post.tags.join(', ') : '';
        document.getElementById('post-featured-image').value = post.featuredImage || '';
        document.getElementById('post-status').value = post.status;
        
        showSection('post-form-section');
    } catch (error) {
        console.error('Error loading post for edit:', error);
        showToast('Error loading post', 'error');
    }
}

async function savePost(event) {
    event.preventDefault();
    
    if (!AuthManager.isAdmin()) {
        showToast('Access denied', 'error');
        return;
    }

    const postId = document.getElementById('post-id').value;
    const postData = {
        title: document.getElementById('post-title').value,
        category: document.getElementById('post-category').value,
        excerpt: document.getElementById('post-excerpt').value,
        content: document.getElementById('post-content').value,
        tags: document.getElementById('post-tags').value,
        featuredImage: document.getElementById('post-featured-image').value,
        status: document.getElementById('post-status').value
    };

    try {
        if (postId) {
            await PostsAPI.updatePost(postId, postData);
            showToast('Post updated successfully!');
        } else {
            await PostsAPI.createPost(postData);
            showToast('Post created successfully!');
        }
        
        showAdminDashboard();
        await AdminManager.loadAdminPosts();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    try {
        await PostsAPI.deletePost(postId);
        showToast('Post deleted successfully!');
        await AdminManager.loadAdminPosts();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Category Management Functions
function showCreateCategory() {
    // Create a better modal dialog for category creation
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create New Category</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="category-form" onsubmit="submitCategoryForm(event)">
                    <div class="form-group">
                        <label for="category-name">Category Name *</label>
                        <input type="text" id="category-name" required maxlength="50">
                    </div>
                    <div class="form-group">
                        <label for="category-description">Description</label>
                        <textarea id="category-description" rows="3" maxlength="200"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Category</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Focus on the name input
    setTimeout(() => {
        document.getElementById('category-name').focus();
    }, 100);
}

async function createCategory(name, description = '') {
    try {
        await CategoriesAPI.createCategory({ name, description });
        showToast('Category created successfully!');
        await AdminManager.loadAdminCategories();
        await PostsManager.loadCategories(); // Refresh category filters
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function editCategory(categoryId) {
    const category = AdminManager.adminCategories.find(c => c._id === categoryId);
    if (!category) return;

    // Create a better modal dialog for category editing
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Category</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="edit-category-form" onsubmit="submitEditCategoryForm(event, '${categoryId}')">
                    <div class="form-group">
                        <label for="edit-category-name">Category Name *</label>
                        <input type="text" id="edit-category-name" value="${category.name}" required maxlength="50">
                    </div>
                    <div class="form-group">
                        <label for="edit-category-description">Description</label>
                        <textarea id="edit-category-description" rows="3" maxlength="200">${category.description || ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Category</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Focus on the name input
    setTimeout(() => {
        document.getElementById('edit-category-name').focus();
    }, 100);
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }

    try {
        await CategoriesAPI.deleteCategory(categoryId);
        showToast('Category deleted successfully!');
        await AdminManager.loadAdminCategories();
        await PostsManager.loadCategories(); // Refresh category filters
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Comment Management Functions
async function updateCommentStatus(commentId, status) {
    try {
        await CommentsAPI.updateCommentStatus(commentId, status);
        showToast(`Comment ${status} successfully!`);
        await AdminManager.loadAdminComments();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deleteCommentAdmin(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    try {
        await CommentsAPI.deleteComment(commentId);
        showToast('Comment deleted successfully!');
        await AdminManager.loadAdminComments();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// New Category Form Functions
async function submitCategoryForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('category-name').value.trim();
    const description = document.getElementById('category-description').value.trim();
    
    if (!name) {
        showToast('Category name is required', 'error');
        return;
    }
    
    try {
        await createCategory(name, description);
        // Close the modal
        document.querySelector('.modal').remove();
    } catch (error) {
        // Error is already handled in createCategory function
    }
}

async function submitEditCategoryForm(event, categoryId) {
    event.preventDefault();
    
    const name = document.getElementById('edit-category-name').value.trim();
    const description = document.getElementById('edit-category-description').value.trim();
    
    if (!name) {
        showToast('Category name is required', 'error');
        return;
    }
    
    try {
        await CategoriesAPI.updateCategory(categoryId, { name, description });
        showToast('Category updated successfully!');
        await AdminManager.loadAdminCategories();
        await PostsManager.loadCategories(); // Refresh category filters
        // Close the modal
        document.querySelector('.modal').remove();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Make functions globally available
window.submitCategoryForm = submitCategoryForm;
window.submitEditCategoryForm = submitEditCategoryForm;
