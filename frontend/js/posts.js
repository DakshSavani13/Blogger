// Posts Management
class PostsManager {
    static currentPage = 1;
    static currentSearch = '';
    static currentCategory = '';
    static posts = [];
    static categories = [];

    static async init() {
        await this.loadCategories();
        await this.loadPosts();
        this.setupEventListeners();
    }

    static async loadCategories() {
        try {
            this.categories = await CategoriesAPI.getCategories();
            this.populateCategoryFilters();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    static populateCategoryFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const postCategorySelect = document.getElementById('post-category');
        
        // Clear existing options (except first one)
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        postCategorySelect.innerHTML = '<option value="">Select Category</option>';
        
        this.categories.forEach(category => {
            const option1 = document.createElement('option');
            option1.value = category.slug;
            option1.textContent = category.name;
            categoryFilter.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = category._id;
            option2.textContent = category.name;
            postCategorySelect.appendChild(option2);
        });
    }

    static async loadPosts(page = 1) {
        try {
            const params = {
                page,
                limit: 9,
                ...(this.currentSearch && { search: this.currentSearch }),
                ...(this.currentCategory && { category: this.currentCategory })
            };

            const response = await PostsAPI.getPosts(params);
            this.posts = response.posts;
            this.currentPage = response.currentPage;
            
            this.renderPosts();
            this.renderPagination(response.totalPages, response.currentPage);
        } catch (error) {
            console.error('Error loading posts:', error);
            showToast('Error loading posts', 'error');
        }
    }

    static renderPosts() {
        const container = document.getElementById('posts-container');
        
        if (this.posts.length === 0) {
            container.innerHTML = '<div class="no-posts">No posts found.</div>';
            return;
        }

        container.innerHTML = this.posts.map(post => `
            <div class="post-card" onclick="showPostDetail('${post.slug}')">
                <div class="post-card-image">
                    ${post.featuredImage ? 
                        `<img src="${post.featuredImage}" alt="${post.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="image-placeholder" style="display: none;"><i class="fas fa-image"></i></div>` :
                        `<div class="image-placeholder"><i class="fas fa-image"></i></div>`
                    }
                </div>
                <div class="post-card-content">
                    <h3>${post.title}</h3>
                    <div class="post-card-meta">
                        <span class="post-card-category">${post.category.name}</span>
                        <span>${formatDate(post.createdAt)}</span>
                    </div>
                    <p>${truncateText(post.excerpt || post.content)}</p>
                    <div class="post-card-footer">
                        <span><i class="fas fa-user"></i> ${post.author.username}</span>
                        <span><i class="fas fa-eye"></i> ${post.views}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static renderPagination(totalPages, currentPage) {
        const container = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button onclick="PostsManager.loadPosts(${currentPage - 1})" 
                    ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `
                    <button onclick="PostsManager.loadPosts(${i})" 
                            class="${i === currentPage ? 'active' : ''}">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += '<span>...</span>';
            }
        }

        // Next button
        paginationHTML += `
            <button onclick="PostsManager.loadPosts(${currentPage + 1})" 
                    ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        container.innerHTML = paginationHTML;
    }

    static setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchPosts();
            }
        });
    }

    static searchPosts() {
        this.currentSearch = document.getElementById('search-input').value;
        this.currentPage = 1;
        this.loadPosts();
    }

    static filterByCategory() {
        this.currentCategory = document.getElementById('category-filter').value;
        this.currentPage = 1;
        this.loadPosts();
    }
}

// Post Detail Functions
async function showPostDetail(slug) {
    try {
        const post = await PostsAPI.getPost(slug);
        renderPostDetail(post);
        showSection('post-detail-section');
        
        // Load comments for this post
        await CommentsManager.loadComments(post._id);
    } catch (error) {
        console.error('Error loading post:', error);
        showToast('Error loading post', 'error');
    }
}

function renderPostDetail(post) {
    const container = document.getElementById('post-detail');
    
    container.innerHTML = `
        <div class="post-detail-header">
            ${post.featuredImage ? `
                <div class="post-detail-image">
                    <img src="${post.featuredImage}" alt="${post.title}" onerror="this.style.display='none';">
                </div>
            ` : ''}
            <h1>${post.title}</h1>
            <div class="post-detail-meta">
                <span><i class="fas fa-user"></i> ${post.author.username}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}</span>
                <span><i class="fas fa-folder"></i> ${post.category.name}</span>
                <span><i class="fas fa-eye"></i> ${post.views} views</span>
            </div>
            ${post.tags && post.tags.length > 0 ? `
                <div class="post-detail-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
        <div class="post-detail-content">
            ${post.content.replace(/\n/g, '<br>')}
        </div>
        <div class="comments-section">
            <h3>Comments</h3>
            ${AuthManager.isAuthenticated() ? `
                <div class="comment-form">
                    <textarea id="comment-content" placeholder="Write your comment..."></textarea>
                    <button class="btn btn-primary" onclick="submitComment('${post._id}')">
                        Post Comment
                    </button>
                </div>
            ` : `
                <p><a href="#" onclick="showLogin()">Login</a> to post a comment.</p>
            `}
            <div id="comments-list" class="comments-list">
                <!-- Comments will be loaded here -->
            </div>
        </div>
    `;
}

// Search and Filter Functions
function searchPosts() {
    PostsManager.searchPosts();
}

function filterByCategory() {
    PostsManager.filterByCategory();
}

// Global search function
window.searchPosts = searchPosts;
window.filterByCategory = filterByCategory;
