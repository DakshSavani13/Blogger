const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Post = require('./models/Post');

// Featured images for posts (using free stock photos from Unsplash)
const postImages = {
    'Introduction to Modern Web Development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy&auto=format',
    'Amazing Weekend Getaways Near You': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=entropy&auto=format',
    'Easy Healthy Recipes for Busy People': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop&crop=entropy&auto=format',
    'Building Better Habits: A Practical Guide': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop&crop=entropy&auto=format'
};

async function addImagesToPosts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        console.log('🖼️  Adding featured images to posts...');

        // Update each post with its featured image
        for (const [title, imageUrl] of Object.entries(postImages)) {
            const post = await Post.findOne({ title });
            if (post) {
                post.featuredImage = imageUrl;
                await post.save();
                console.log(`✅ Added image to: ${title}`);
            } else {
                console.log(`⚠️  Post not found: ${title}`);
            }
        }

        console.log('\n🎉 Featured images added successfully!');
        console.log('\n🌐 Refresh your blog at http://localhost:3000 to see the images');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding images:', error);
        process.exit(1);
    }
}

// Run the script
addImagesToPosts();
