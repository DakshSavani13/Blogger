// Comments Management
class CommentsManager {
    static comments = [];
    static currentPostId = null;

    static async loadComments(postId) {
        this.currentPostId = postId;
        try {
            const response = await CommentsAPI.getComments(postId);
            this.comments = response.comments;
            this.renderComments();
        } catch (error) {
            console.error('Error loading comments:', error);
            showToast('Error loading comments', 'error');
        }
    }

    static renderComments() {
        const container = document.getElementById('comments-list');
        
        if (this.comments.length === 0) {
            container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }

        container.innerHTML = this.comments.map(comment => this.renderComment(comment)).join('');
    }

    static renderComment(comment) {
        const canEdit = AuthManager.isAuthenticated() && 
                       (AuthManager.currentUser.id === comment.author._id || AuthManager.isAdmin());

        return `
            <div class="comment" data-comment-id="${comment._id}">
                <div class="comment-header">
                    <span class="comment-author">
                        <i class="fas fa-user-circle"></i> ${comment.author.username}
                    </span>
                    <span class="comment-date">${formatDate(comment.createdAt)}</span>
                </div>
                <div class="comment-content" id="comment-content-${comment._id}">
                    ${comment.content}
                </div>
                ${canEdit ? `
                    <div class="comment-actions">
                        <button class="btn-link" onclick="editComment('${comment._id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-link text-danger" onclick="deleteComment('${comment._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                ` : ''}
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="comment-replies">
                        ${comment.replies.map(reply => this.renderReply(reply)).join('')}
                    </div>
                ` : ''}
                ${AuthManager.isAuthenticated() ? `
                    <div class="reply-form" id="reply-form-${comment._id}" style="display: none;">
                        <textarea id="reply-content-${comment._id}" placeholder="Write a reply..."></textarea>
                        <div class="reply-actions">
                            <button class="btn btn-sm btn-primary" onclick="submitReply('${comment._id}')">
                                Reply
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="cancelReply('${comment._id}')">
                                Cancel
                            </button>
                        </div>
                    </div>
                    <button class="btn-link" onclick="showReplyForm('${comment._id}')">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                ` : ''}
            </div>
        `;
    }

    static renderReply(reply) {
        const canEdit = AuthManager.isAuthenticated() && 
                       (AuthManager.currentUser.id === reply.author._id || AuthManager.isAdmin());

        return `
            <div class="comment reply" data-comment-id="${reply._id}">
                <div class="comment-header">
                    <span class="comment-author">
                        <i class="fas fa-user-circle"></i> ${reply.author.username}
                    </span>
                    <span class="comment-date">${formatDate(reply.createdAt)}</span>
                </div>
                <div class="comment-content" id="comment-content-${reply._id}">
                    ${reply.content}
                </div>
                ${canEdit ? `
                    <div class="comment-actions">
                        <button class="btn-link" onclick="editComment('${reply._id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-link text-danger" onclick="deleteComment('${reply._id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Comment Functions
async function submitComment(postId) {
    if (!AuthManager.isAuthenticated()) {
        showToast('Please login to comment', 'error');
        return;
    }

    const content = document.getElementById('comment-content').value.trim();
    
    if (!content) {
        showToast('Please enter a comment', 'error');
        return;
    }

    try {
        await CommentsAPI.createComment({
            content,
            postId
        });
        
        document.getElementById('comment-content').value = '';
        await CommentsManager.loadComments(postId);
        showToast('Comment posted successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function submitReply(parentCommentId) {
    if (!AuthManager.isAuthenticated()) {
        showToast('Please login to reply', 'error');
        return;
    }

    const content = document.getElementById(`reply-content-${parentCommentId}`).value.trim();
    
    if (!content) {
        showToast('Please enter a reply', 'error');
        return;
    }

    try {
        await CommentsAPI.createComment({
            content,
            postId: CommentsManager.currentPostId,
            parentCommentId
        });
        
        cancelReply(parentCommentId);
        await CommentsManager.loadComments(CommentsManager.currentPostId);
        showToast('Reply posted successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function showReplyForm(commentId) {
    // Hide all other reply forms
    document.querySelectorAll('.reply-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show this reply form
    document.getElementById(`reply-form-${commentId}`).style.display = 'block';
}

function cancelReply(commentId) {
    document.getElementById(`reply-form-${commentId}`).style.display = 'none';
    document.getElementById(`reply-content-${commentId}`).value = '';
}

async function editComment(commentId) {
    const contentElement = document.getElementById(`comment-content-${commentId}`);
    const currentContent = contentElement.textContent.trim();
    
    // Create edit form
    contentElement.innerHTML = `
        <textarea id="edit-content-${commentId}" class="edit-textarea">${currentContent}</textarea>
        <div class="edit-actions">
            <button class="btn btn-sm btn-primary" onclick="saveComment('${commentId}')">
                Save
            </button>
            <button class="btn btn-sm btn-outline" onclick="cancelEdit('${commentId}', '${currentContent}')">
                Cancel
            </button>
        </div>
    `;
}

async function saveComment(commentId) {
    const newContent = document.getElementById(`edit-content-${commentId}`).value.trim();
    
    if (!newContent) {
        showToast('Comment cannot be empty', 'error');
        return;
    }

    try {
        await CommentsAPI.updateComment(commentId, { content: newContent });
        await CommentsManager.loadComments(CommentsManager.currentPostId);
        showToast('Comment updated successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function cancelEdit(commentId, originalContent) {
    document.getElementById(`comment-content-${commentId}`).textContent = originalContent;
}

async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    try {
        await CommentsAPI.deleteComment(commentId);
        await CommentsManager.loadComments(CommentsManager.currentPostId);
        showToast('Comment deleted successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}
